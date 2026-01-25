import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PagesModule } from './pages/pages.module';
import { SectionsModule } from './sections/sections.module';
import { MediaModule } from './media/media.module';
import { MenusModule } from './menus/menus.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PagesModule,
    PostsModule,
    CategoriesModule,
    SectionsModule,
    MediaModule,
    MenusModule,
    SiteSettingsModule,
    AdvertisementsModule,
  ],
})
export class AppModule {}
