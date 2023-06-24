import { ActionIcon, Card, Space, Text, useMantineTheme } from "@mantine/core";
import { useBreedImageUrl } from "../APIs/cats";
import { Link } from "react-router-dom";
import { EmptyBreedImage } from "./emptyBreedImage";
import { GrHide } from "react-icons/gr";
import { useCallback, useMemo, useState } from "react";
import { useHideContext } from "../contexts/hideContext";
import { useClickOutside } from "@mantine/hooks";
import { doNothing } from "../utilities";

export function BreedLinkCard({ breed }) {
    const [image] = useBreedImageUrl(breed.id);
    const theme = useMantineTheme();
    const [emphasizeHideButton, setEmphasizeHideButton] = useState(false);
    const { isHidden, hide } = useHideContext(breed);
    const clearEmphasizeHideButton = useCallback(() => emphasizeHideButton && setEmphasizeHideButton(false), [emphasizeHideButton]);
    const ref = useClickOutside(clearEmphasizeHideButton);

    const hideButtonSx = useMemo(() => {
        if (emphasizeHideButton) {
            return {
                top: '50%',
                right: '50%',
                transform: 'translate(50%, -50%) scale(2)',
                '&:active': {
                    filter: 'brightness(0.8)',
                    transform: 'translate(50%, -50%) scale(1.95)',
                }
            }
        } else {
            return {
                transform: 'translate(15%, -15%)',
                top: 0,
                right: 0,
                '&:active': {
                    filter: 'brightness(0.8)',
                    transform: 'translate(15%, -15%) scale(0.95)',
                }
            }
        }
    }, [emphasizeHideButton]);

    if (isHidden) {
        return null;
    }

    const onClickHideButton = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (emphasizeHideButton) {
            hide();
        } else {
            setEmphasizeHideButton(true);
        }
    };

    return <Card ref={ref} component={Link} to={`/breed/${breed.id}`} display='flex' shadow='sm' radius='md' w="100%" h='100%' maw={350} mah={350} sx={{ overflow: 'visible' }}>
        <Card.Section sx={{
            height: 'min-content', display: 'flex', flex: '1 1 auto',
            height: '100%',
            width: '100%',
            '& > img': {
                height: '100%',
                width: '100%',
            }
        }}>
            {image?.url && (
                <img
                    src={image.url}
                    loading='lazy'
                    alt={`Image of ${breed?.name} cat.`}
                    style={{
                        position: "absolute",
                        objectFit: "cover",
                    }}
                />
            )}
            {!image?.url && (
                <EmptyBreedImage />
            )}
            <Text sx={{ width: '100%', textAlign: 'center', position: 'absolute', bottom: 0, left: 0, zIndex: 1, background: '#ffffffA0', backdropFilter: 'blur(3px)' }}>{breed?.name}</Text>
            {emphasizeHideButton && <Space onClick={doNothing} h='100%' w='100%' sx={{ position: 'absolute', top: 0, left: 0, background: '#00000050' }} />}
            <ActionIcon onClick={onClickHideButton} size='lg' bg={`${theme.colors.red[6]}60`} variant="filled" radius='md' sx={[hideButtonSx, { position: 'absolute', transition: '0.2s', zIndex: 1, backdropFilter: 'blur(3px)', path: { stroke: 'white' } }]}>
                <GrHide fontSize='1.2rem' color="white" />
            </ActionIcon>
        </Card.Section>
    </Card>
}