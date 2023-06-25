import { Link } from "react-router-dom";
import { Button, Tooltip, rem } from "@mantine/core";

export function LinkLogo({ alt, src, ...props }) {
    return <img src={src} alt={alt} height={30} width='auto' {...props} />
}

/**
 * Button with an icon for a link.  
 * This is used for external site links
 * @param {{
 *   Icon: import('react').FC<any>,
 *   href: string,
 *   label: string
 * }} props 
 * @returns 
 */
export function IconLink({ Icon, href, label }) {
    return (
        <Tooltip label={label}>
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