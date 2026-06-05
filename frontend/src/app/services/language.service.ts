import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'vi' | 'en' | 'ja';

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
];

const STORAGE_KEY = 'app_lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private localStorage?: Storage;

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) doc: Document,
  ) {
    this.localStorage = doc.defaultView?.localStorage;
    translate.addLangs(['vi', 'en', 'ja']);
    translate.setDefaultLang('vi');
  }

  init(): void {
    const saved = (this.localStorage?.getItem(STORAGE_KEY) ?? 'vi') as Lang;
    this.setLang(saved);
  }

  setLang(lang: Lang): void {
    this.translate.use(lang);
    this.localStorage?.setItem(STORAGE_KEY, lang);
  }

  get current(): Lang {
    return (this.translate.currentLang ?? 'vi') as Lang;
  }

  get languages() { return LANGUAGES; }
}
