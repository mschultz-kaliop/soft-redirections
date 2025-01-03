import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({strapi}: { strapi: Core.Strapi }) {
    await createAdminUser(strapi)
    await createMockArticles(strapi)
  },
}

async function createAdminUser(strapi: Core.Strapi) {
  console.log(`[STRAPI][LOG][createAdminUser][INFO] Started`)
  const adminService = strapi.admin.services.user
  const roleService = strapi.admin.services.role

  try {
    const existingAdmins = await adminService.exists()
    if (existingAdmins) {
      console.log('[STRAPI][LOG][createAdminUser][SUCESS] Admin already exists')
      return
    }

    const hashedPassword = await strapi.admin.services.auth.hashPassword('Admin1234!')

    const newAdmin = {
      email: 'admin@kaliop.com',
      firstname: 'Super',
      lastname: 'Admin',
      password: hashedPassword,
      isActive: true,
      roles: [ await roleService.getSuperAdmin() ],
    }

    await adminService.create(newAdmin)

    console.log(`[STRAPI][LOG][createAdminUser][SUCESS] Admin created = ${ newAdmin.email }`)
  } catch (e) {
    console.log(`[STRAPI][LOG][createAdminUser][ERROR]`)
    console.log(e)
  }
}

async function createMockArticles(strapi: Core.Strapi) {
  console.log(`[STRAPI][LOG][createMockArticles][INFO] Started`)
  const articleService = strapi.service('api::article.article')

  try {
    const existingArticles = await articleService.find()
    if (existingArticles.results.length > 0) {
      console.log('[STRAPI][LOG][createMockArticles][SUCESS] Articles already exist')
      return
    }

    const articles = [
      {
        title: 'A Guide to Understanding Arcane Symbols',
        slug: 'a-guide-to-understanding-arcane-symbols',
        body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
      {
        title: 'How to Master Arcane Magic Techniques',
        slug: 'how-to-master-arcane-magic-techniques',
        body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
      {
        title: 'Spider-Verse Explained: A Beginner’s Guide',
        slug: 'spider-verse-explained-a-beginner-s-guide',
        body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
      {
        title: 'What Does Spider-Man Eat for Breakfast ?',
        slug: 'what-does-spider-man-eat-for-breakfast',
        body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      },
      {
        title: 'Who Is Jinx ? The Enigma of Zaun',
        slug: 'who-is-jinx-the-enigma-of-zaun',
        body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      }
    ]

    for (const article of articles) {
      await articleService.create({ data: article })
      console.log(`Article "${article.title}" created.`)
    }
    console.log(`[STRAPI][LOG][createMockArticles][SUCESS] Ended`)
  } catch (e) {
    console.log(`[STRAPI][LOG][createMockArticles][ERROR]`)
    console.log(e)
  }
}
