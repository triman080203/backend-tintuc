IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'FILES') IS NULL EXEC(N'CREATE SCHEMA [FILES];');
GO

CREATE TABLE [FILES].[Files] (
    [Id] int NOT NULL IDENTITY,
    [FileName] nvarchar(255) NOT NULL,
    [StoredFileName] nvarchar(255) NOT NULL,
    [FilePath] nvarchar(500) NOT NULL,
    [FileSize] bigint NOT NULL,
    [ContentType] nvarchar(100) NOT NULL,
    [EntityId] int NULL,
    [EntityType] nvarchar(100) NULL,
    [Description] nvarchar(500) NULL,
    [Ordinal] int NOT NULL,
    [UploadedById] int NULL,
    [UploadedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Files] PRIMARY KEY ([Id])
);
GO

CREATE INDEX [IX_Files_EntityId_EntityType] ON [FILES].[Files] ([EntityId], [EntityType]);
GO

CREATE INDEX [IX_Files_UploadedAt] ON [FILES].[Files] ([UploadedAt]);
GO

CREATE INDEX [IX_Files_UploadedById] ON [FILES].[Files] ([UploadedById]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250916100023_InitialCreate_Files', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [FILES].[Files] ADD [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID());
GO

CREATE UNIQUE INDEX [IX_Files_PublicId] ON [FILES].[Files] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917153340_AddPublicIdToFiles', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [FILES].[Files] ADD [EntityPublicId] uniqueidentifier NULL;
GO

CREATE INDEX [IX_Files_EntityPublicId_EntityType] ON [FILES].[Files] ([EntityPublicId], [EntityType]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917154533_AddEntityPublicIdToFiles', N'8.0.0');
GO

COMMIT;
GO

