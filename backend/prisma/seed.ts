import { PrismaClient, UserRole, PageStatus, SectionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cms.com' },
    update: {},
    create: {
      email: 'admin@cms.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@cms.com' },
    update: {},
    create: {
      email: 'editor@cms.com',
      password: editorPassword,
      role: UserRole.EDITOR,
    },
  });

  console.log('✅ Users created');

  // Create sample pages
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      status: PageStatus.PUBLISHED,
      seoTitle: 'Welcome to Our Website',
      seoDescription: 'This is the homepage of our custom CMS website',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });

  const aboutPage = await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      title: 'About Us',
      slug: 'about',
      status: PageStatus.PUBLISHED,
      seoTitle: 'About Us - Our Story',
      seoDescription: 'Learn more about our company and mission',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });

  console.log('✅ Pages created');

  // Create sections for home page
  await prisma.section.createMany({
    data: [
      {
        pageId: homePage.id,
        type: SectionType.HERO,
        order: 0,
        content: {
          heading: 'Welcome to Our Custom CMS',
          subheading: 'Build beautiful websites with ease',
          image: '/uploads/hero.png',
          buttonText: 'Get Started',
          buttonLink: '/start',
        },
      },
      {
        pageId: homePage.id,
        type: SectionType.TEXT,
        order: 1,
        content: {
          title: 'Why Choose Us?',
          content: '<p>Our custom CMS provides you with complete control over your website content. Build pages, manage sections, and create beautiful experiences.</p>',
        },
      },
      {
        pageId: homePage.id,
        type: SectionType.CTA,
        order: 2,
        content: {
          title: 'Ready to Get Started?',
          description: 'Join thousands of satisfied customers',
          buttonText: 'Contact Us',
          buttonLink: '/contact',
        },
      },
    ],
    skipDuplicates: true,
  });

  // Create sections for about page
  await prisma.section.createMany({
    data: [
      {
        pageId: aboutPage.id,
        type: SectionType.TEXT,
        order: 0,
        content: {
          title: 'Our Story',
          content: '<p>We are a team of passionate developers building custom solutions for businesses worldwide.</p>',
        },
      },
      {
        pageId: aboutPage.id,
        type: SectionType.FAQ,
        order: 1,
        content: {
          items: [
            {
              question: 'What is this CMS?',
              answer: 'A fully custom content management system built with modern technologies.',
            },
            {
              question: 'How do I get started?',
              answer: 'Simply log in to the admin panel and start creating pages!',
            },
          ],
        },
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Sections created');

  // Create menus
  const headerMenu = await prisma.menu.upsert({
    where: { location: 'header' },
    update: {},
    create: {
      name: 'Main Navigation',
      location: 'header',
    },
  });

  const footerMenu = await prisma.menu.upsert({
    where: { location: 'footer' },
    update: {},
    create: {
      name: 'Footer Links',
      location: 'footer',
    },
  });

  // Create menu items
  await prisma.menuItem.createMany({
    data: [
      {
        menuId: headerMenu.id,
        label: 'Home',
        url: '/home',
        order: 0,
      },
      {
        menuId: headerMenu.id,
        label: 'About',
        url: '/about',
        order: 1,
      },
      {
        menuId: footerMenu.id,
        label: 'Privacy Policy',
        url: '/privacy',
        order: 0,
      },
      {
        menuId: footerMenu.id,
        label: 'Terms of Service',
        url: '/terms',
        order: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Menus created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@cms.com / admin123');
  console.log('Editor: editor@cms.com / editor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
