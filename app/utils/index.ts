import I18n from '@ioc:Adonis/Addons/I18n'
import { DateTime } from 'luxon'

export function formatDate(date: number, locale: string = 'fr-FR'): string {
  return I18n.locale(locale).formatDate(DateTime.fromMillis(date))
}

export function formatCurrency(value: number, currency: string, locale: string = 'fr'): string {
  return I18n.locale(locale).formatCurrency(value, { currency })
}
