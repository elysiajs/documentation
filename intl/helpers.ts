import { AvailableLocales } from './locales'
import strings from './strings'

function getTranslation(key: string, lang: AvailableLocales) {
    // Use the key as the fallback if nothing exists in translations.json
    const anyTranslation = strings.hasOwnProperty(key)
    if (!anyTranslation) {
        return key
    }
    // Do we have the exact translation?
    const thisTranslation = anyTranslation && strings[key].hasOwnProperty(lang)
    if (thisTranslation) {
        return strings[key][lang]
    }
    // Do we have a fallback?
    // Failsafe if something is truly whack
    return key
}
export function replaceLocalizedContent(
    passedObj: any,
    lang: AvailableLocales
) {
    const obj = passedObj
    // Check if the input is an object
    if (typeof obj === 'object' && obj !== null) {
        // Iterate over the object properties
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // Check if the current property is named "text"
                if (key === 'text' || key === 'link') {
                    if (key === 'text') {
                        // Look for translated strings
                        obj[key] = getTranslation(obj[key], lang)
                    }
                    if (key === 'link' && lang !== 'en') {
                        obj[key] = `${lang}${obj[key]}`
                    }
                } else {
                    // If the current property is not "text", recursively process its value
                    replaceLocalizedContent(obj[key], lang)
                }
            }
        }
    }
    return obj
}
