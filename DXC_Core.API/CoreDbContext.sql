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

IF SCHEMA_ID(N'IDENTITY') IS NULL EXEC(N'CREATE SCHEMA [IDENTITY];');
GO

CREATE TABLE [IDENTITY].[Users] (
    [Id] int NOT NULL IDENTITY,
    [FullName] nvarchar(max) NOT NULL,
    [UserName] nvarchar(450) NOT NULL,
    [Email] nvarchar(450) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [IDENTITY].[Users] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Users_UserName] ON [IDENTITY].[Users] ([UserName]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250908165934_InitialCreate', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [IDENTITY].[Roles] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [IDENTITY].[UserRoles] (
    [UserId] int NOT NULL,
    [RoleId] int NOT NULL,
    CONSTRAINT [PK_UserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_UserRoles_Roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [IDENTITY].[Roles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserRoles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [IDENTITY].[Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Roles_Name] ON [IDENTITY].[Roles] ([Name]);
GO

CREATE INDEX [IX_UserRoles_RoleId] ON [IDENTITY].[UserRoles] ([RoleId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250909021901_AddRolesAndUserRoles', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [IDENTITY].[Users] ADD [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID());
GO

CREATE UNIQUE INDEX [IX_Users_PublicId] ON [IDENTITY].[Users] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250909080123_AddPublicIdToUsers', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [IDENTITY].[Roles] ADD [Code] nvarchar(450) NULL;
GO

CREATE UNIQUE INDEX [IX_Roles_Code] ON [IDENTITY].[Roles] ([Code]) WHERE [Code] IS NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250909091542_AddNullableCodeToRoles', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DROP INDEX [IX_Roles_Code] ON [IDENTITY].[Roles];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IDENTITY].[Roles]') AND [c].[name] = N'Code');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [IDENTITY].[Roles] DROP CONSTRAINT [' + @var0 + '];');
UPDATE [IDENTITY].[Roles] SET [Code] = N'' WHERE [Code] IS NULL;
ALTER TABLE [IDENTITY].[Roles] ALTER COLUMN [Code] nvarchar(450) NOT NULL;
ALTER TABLE [IDENTITY].[Roles] ADD DEFAULT N'' FOR [Code];
GO

CREATE UNIQUE INDEX [IX_Roles_Code] ON [IDENTITY].[Roles] ([Code]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250909091707_MakeRoleCodeRequiredAndUnique', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [IDENTITY].[Roles] ADD [Description] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250916014400_AddDescriptionToRoles', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [IDENTITY].[Roles] ADD [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWSEQUENTIALID());
GO

CREATE UNIQUE INDEX [IX_Roles_PublicId] ON [IDENTITY].[Roles] ([PublicId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250917153316_AddPublicIdToRoles', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF SCHEMA_ID(N'COMMON') IS NULL EXEC(N'CREATE SCHEMA [COMMON];');
GO

IF SCHEMA_ID(N'PROFILE') IS NULL EXEC(N'CREATE SCHEMA [PROFILE];');
GO

CREATE TABLE [COMMON].[Organizations] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [Code] nvarchar(450) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Organizations] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [PROFILE].[UserProfiles] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [UserId] int NOT NULL,
    [Address] nvarchar(max) NULL,
    [Workplace] nvarchar(max) NULL,
    [JobTitle] nvarchar(max) NULL,
    [Position] nvarchar(max) NULL,
    [Gender] bit NULL,
    [DateOfBirth] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_UserProfiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [IDENTITY].[Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [COMMON].[Departments] (
    [Id] int NOT NULL IDENTITY,
    [PublicId] uniqueidentifier NOT NULL DEFAULT (NEWID()),
    [OrganizationId] int NOT NULL,
    [Code] nvarchar(450) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Departments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Departments_Organizations_OrganizationId] FOREIGN KEY ([OrganizationId]) REFERENCES [COMMON].[Organizations] ([Id]) ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX [IX_Departments_OrganizationId_Code] ON [COMMON].[Departments] ([OrganizationId], [Code]);
GO

CREATE UNIQUE INDEX [IX_Departments_PublicId] ON [COMMON].[Departments] ([PublicId]);
GO

CREATE UNIQUE INDEX [IX_Organizations_Code] ON [COMMON].[Organizations] ([Code]);
GO

CREATE UNIQUE INDEX [IX_Organizations_PublicId] ON [COMMON].[Organizations] ([PublicId]);
GO

CREATE UNIQUE INDEX [IX_UserProfiles_PublicId] ON [PROFILE].[UserProfiles] ([PublicId]);
GO

CREATE UNIQUE INDEX [IX_UserProfiles_UserId] ON [PROFILE].[UserProfiles] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251016101629_AddUserProfileSchema', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251016101638_AddCommonCatalogSchemas', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [PROFILE].[UserProfiles] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

CREATE TABLE [COMMON].[UserDepartments] (
    [UserId] int NOT NULL,
    [DepartmentId] int NOT NULL,
    CONSTRAINT [PK_UserDepartments] PRIMARY KEY ([UserId], [DepartmentId]),
    CONSTRAINT [FK_UserDepartments_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [COMMON].[Departments] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_UserDepartments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [IDENTITY].[Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_UserDepartments_DepartmentId] ON [COMMON].[UserDepartments] ([DepartmentId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251018172356_AddUserDepartmentTable', N'8.0.0');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [COMMON].[Departments] ADD [ContactEmail] nvarchar(max) NULL;
GO

ALTER TABLE [COMMON].[Departments] ADD [ContactPhone] nvarchar(max) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251018174702_AddContactFieldsToDepartment', N'8.0.0');
GO

COMMIT;
GO

