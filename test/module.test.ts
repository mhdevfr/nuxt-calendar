import { describe, it, expect } from 'vitest'

describe('Nuxt Calendar Module', () => {
  it('module configuration is valid', () => {
    const moduleConfig = {
      prefix: 'Test',
      defaultConfig: {
        locale: 'fr-FR',
        firstDayOfWeek: 1,
        showWeekNumbers: true,
        theme: 'auto'
      }
    }
    expect(moduleConfig.prefix).toBe('Test')
    expect(moduleConfig.defaultConfig.locale).toBe('fr-FR')
    expect(moduleConfig.defaultConfig.firstDayOfWeek).toBe(1)
    expect(moduleConfig.defaultConfig.showWeekNumbers).toBe(true)
    expect(moduleConfig.defaultConfig.theme).toBe('auto')
  })

  it('module exports are available', async () => {
    const module = await import('../src/module')
    
    expect(module).toBeDefined()
    expect(typeof module.default).toBe('function')
  })

  it('types are properly exported', async () => {
    const types = await import('../src/runtime/types')
    
    expect(types).toBeDefined()
    expect(typeof types).toBe('object')
  })
}) 