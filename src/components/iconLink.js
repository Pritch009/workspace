import { Link } from "react-router-dom";
import { Button, Tooltip, rem } from "@mantine/core";
import { forwardRef } from "react";
import { motion } from "framer-motion/dist/framer-motion";

export function LinkLogo({ alt, src, ...props }) {
    return <img src={src} alt={alt} height={30} width='auto' {...props} />
}

/**
 * Button with an icon for a link.  
 * This is used for external site links
 * @param {{
 *   Icon: import('react').FC<any>,
 *   href: import { motion } from 'framer-motion/dist/framer-motion';
string,
 *   label: string
 * }} props 
 * @returns 
 */
export const IconLink = motion(forwardRef(
    function IconLink({ Icon, href, label }, ref) {
        return (
            <Tooltip label={label} ref={ref}>
                <Button
                    variant="outline"
                    component={Link}
                    radius={100}
                    to={href}
                    size='lg'
                    bg='white'
                    sx={{
                        textDecoration: "none",
                    }}
                >
                    <Icon fontSize={rem(18)} />
                </Button>
            </Tooltip>
        );
    }
))