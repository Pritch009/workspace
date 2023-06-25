import React, { forwardRef, useMemo } from 'react';
import { Text, rem } from '@mantine/core';

/**
 * Displays the nation flag emoji for a given country code
 * @param {{
 *  countryCode: string,
 *  sx: any,
 * } & import('react').ComponentPropsWithRef<'div'>} props
 * @returns {JSX.Element}
 */
export const NationalFlag = forwardRef(
    function NationalFlag({ countryCode, sx, ...props }, ref) {
        // given a country code, return the flag as an unicode emoji
        const flag = useMemo(() => getNationalFlagChar(countryCode), [countryCode]);
        return <Text ref={ref} {...props} sx={[sx, {
            fontSize: rem(24), lineHeight: 'normal'
        }]}>{flag}</Text>
    }
);

/**
 * Returns the flag emoji for a given country code
 * @param {string} countryCode 
 * @returns 
 */
export function getNationalFlagChar(countryCode) {
    // AE,AU,CA,CN,CY,EG,FR,GB,GR,IM,IR,JP,MM,NO,RU,SO,SP,TH,TR,US
    switch (countryCode) {
        case 'AE':
            return '🇦🇪';
        case 'AU':
            return '🇦🇺';
        case 'CA':
            return '🇨🇦';
        case 'CN':
            return '🇨🇳';
        case 'CY':
            return '🇨🇾';
        case 'EG':
            return '🇪🇬';
        case 'FR':
            return '🇫🇷';
        case 'GB':
            return '🇬🇧';
        case 'GR':
            return '🇬🇷';
        case 'IM':
            return '🇮🇲';
        case 'IR':
            return '🇮🇷';
        case 'JP':
            return '🇯🇵';
        case 'MM':
            return '🇲🇲';
        case 'NO':
            return '🇳🇴';
        case 'RU':
            return '🇷🇺';
        case 'SO':
            return '🇸🇴';
        case 'SP':
            return '🇪🇸';
        case 'TH':
            return '🇹🇭';
        case 'TR':
            return '🇹🇷';
        case 'US':
            return '🇺🇸';
        default:
            return countryCode;
    }
}