'use server';

import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { defaultLocale } from '@/i18n/config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, locale);
}

const localesDir = path.resolve(process.cwd(), 'lang');

export const getAvailableLangs = async () => {
    const files = await fs.promises.readdir(localesDir);
    const langFiles = files.filter(file => file.endsWith('.json'));

    const langDataPromises = langFiles.map(file =>
        fs.promises.readFile(path.join(localesDir, file), 'utf-8').then(data => {
            const parsedData = JSON.parse(data);
            const langCode = file.replace('.json', '');
            const langName = parsedData.language || langCode;
            const flag = parsedData.flag || langCode.toUpperCase();

            return {
                [langCode]: {
                    language: langName,
                    flag: flag,
                }
            };
        })
    );

    const langDataArray = await Promise.all(langDataPromises);
    return Object.assign({}, ...langDataArray);
};