import { defineNuxtModule, addComponentsDir, addImportsDir, createResolver, installModule } from '@nuxt/kit'
export interface ModuleOptions {
  
  prefix?: string
  
  
  defaultConfig?: {
    locale?: string
    firstDayOfWeek?: number
    showWeekNumbers?: boolean
    theme?: 'light' | 'dark' | 'auto'
    timezone?: string
    workingHours?: {
      morning: number[]
      afternoon: number[]
    }
  }
  
  /**
   * Enable i18n support
   * @default true
   */
  i18n?: boolean
  
  /**
   * Enable analytics tracking
   * @default false
   */
  analytics?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/calendar',
    configKey: 'calendar',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },

  defaults: {
    prefix: '',
    defaultConfig: {
      locale: 'fr-FR',
      firstDayOfWeek: 1,
      showWeekNumbers: false,
      theme: 'auto',
      timezone: 'Europe/Paris',
      workingHours: {
        morning: [9, 10, 11, 12],
        afternoon: [14, 15, 16]
      }
    },
    i18n: true,
    analytics: false
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)


    if (options.i18n) {
      try {
        await installModule('@nuxtjs/i18n')
      } catch (error) {
        // out error
      }
    }


            addComponentsDir({
              path: resolver.resolve('./runtime/components'),
              prefix: options.prefix,
              global: true
            })


    addImportsDir(resolver.resolve('./runtime/composables'))


    nuxt.options.runtimeConfig.public.calendar = {
      ...options.defaultConfig
    }


    nuxt.options.css.push(resolver.resolve('./runtime/assets/calendar.css'))


    if (!nuxt.options.css.includes('lucide-vue-next')) {
      // out error
    }


    // VueUse removed to avoid conflicts in host projects
  }
})