import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVideoGenresType1743526416625 implements MigrationInterface {
    name = 'UpdateVideoGenresType1743526416625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar uma coluna temporária para armazenar os novos valores
        await queryRunner.query(`ALTER TABLE "videos" ADD "genres_new" integer[] NULL DEFAULT '{}'`);

        // Copiar e converter os dados existentes
        await queryRunner.query(`
            WITH split_genres AS (
                SELECT id, unnest(string_to_array(genres, ',')) AS genre
                FROM videos
                WHERE genres IS NOT NULL
            ),
            numeric_genres AS (
                SELECT id, NULLIF(REGEXP_REPLACE(genre, '[^0-9]', '', 'g'), '')::integer AS genre_num
                FROM split_genres
                WHERE REGEXP_REPLACE(genre, '[^0-9]', '', 'g') <> ''
            ),
            aggregated_genres AS (
                SELECT id, array_agg(genre_num) AS genres_array
                FROM numeric_genres
                GROUP BY id
            )
            UPDATE videos v
            SET genres_new = ag.genres_array
            FROM aggregated_genres ag
            WHERE v.id = ag.id
        `);

        // Remover a coluna antiga
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "genres"`);

        // Renomear a nova coluna
        await queryRunner.query(`ALTER TABLE "videos" RENAME COLUMN "genres_new" TO "genres"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Criar uma coluna temporária para armazenar os valores antigos
        await queryRunner.query(`ALTER TABLE "videos" ADD "genres_old" text NULL`);

        // Copiar e converter os dados de volta
        await queryRunner.query(`
            UPDATE "videos"
            SET "genres_old" = array_to_string(genres, ',')
            WHERE genres IS NOT NULL
        `);

        // Remover a coluna nova
        await queryRunner.query(`ALTER TABLE "videos" DROP COLUMN "genres"`);

        // Renomear a coluna antiga
        await queryRunner.query(`ALTER TABLE "videos" RENAME COLUMN "genres_old" TO "genres"`);
    }
}
