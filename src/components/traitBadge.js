import { Badge } from '@mantine/core';
import { forwardRef } from 'react';

/**
 * @typedef TraitBadgeProps
 * @property {number} value
 * @property {string} color
 * @property {string} display
 * @property {boolean} invert
 * @property {JSX.Element} leftSection
 */

/**
 * Badge to display if a breed has a certain trait
 * These valeus are stored as 0 or 1 in the API
 * 
 * @param {TraitBadgeProps} props 
 * @returns {JSX.Element}
 */
export const TraitBadge = forwardRef(
    function TraitBadge({ color, display, leftSection }, ref) {
        return <Badge ref={ref} size='lg' leftSection={leftSection} styles={{ leftSection: { display: 'flex' } }} color={color}>
            {display}
        </Badge>
    }
)