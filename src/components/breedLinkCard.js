import { ActionIcon, Card, Space, Text, useMantineTheme, Box, rem } from "@mantine/core";
import { useBreedImageUrl, useBreedReferenceImage } from "../APIs/cats";
import { Link } from "react-router-dom";
import { EmptyBreedImage } from "./emptyBreedImage";
import { GrHide } from "react-icons/gr";
import { useCallback, useMemo, useState } from "react";
import { useIsHidden } from "../contexts/hideContext";
import { useClickOutside } from "@mantine/hooks";
import { doNothing } from "../utilities";
import { BiShow } from "react-icons/bi";

export function BreedLinkCard({ breed, ignoreHidden = false }) {
    const image = useBreedReferenceImage(breed?.reference_image_id);
    const theme = useMantineTheme();
    const [emphasizeHideButton, setEmphasizeHideButton] = useState(false);
    const { isHidden, hide, show } = useIsHidden(breed);
    const clearEmphasizeHideButton = useCallback(() => emphasizeHideButton && setEmphasizeHideButton(false), [emphasizeHideButton]);
    const ref = useClickOutside(clearEmphasizeHideButton);
    const DisplayIcon = useMemo(() => {
        return !ignoreHidden ? GrHide : BiShow;
    }, [ignoreHidden]);

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

    if (isHidden && !ignoreHidden) {
        return null;
    }

    const onClickHideButton = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (emphasizeHideButton) {
            const action = ignoreHidden ? show : hide;
            action();
            setEmphasizeHideButton(false);
        } else {
            setEmphasizeHideButton(true);
        }
    };

    return <Box ref={ref} sx={{ position: 'relative', aspectRatio: '1/1' }}>
        <Card component={Link} to={`/breed/${breed.id}`} display='flex' shadow='sm' radius='md' w="100%" h='100%'>
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
                        src={image?.url}
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
                <Text
                    sx={{
                        minWidth: '100%',
                        width: 'fit-content',
                        maxWidth: '100%',
                        textAlign: 'center',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: 1,
                        background: '#ffffffA0',
                        backdropFilter: 'blur(3px)',
                        lineClamp: 1,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                    {breed?.name}
                </Text>
                {emphasizeHideButton && <Space onClick={doNothing} h='100%' w='100%' sx={{ position: 'absolute', top: 0, left: 0, background: '#00000050' }} />}
            </Card.Section>
        </Card>
        <ActionIcon onClick={onClickHideButton} size='lg' bg={`${theme.colors[ignoreHidden ? 'blue' : 'red'][6]}70`} variant="filled" radius='md' sx={[hideButtonSx, { position: 'absolute', transition: '0.2s', zIndex: 1, backdropFilter: 'blur(3px)', path: { stroke: 'white' } }]}>
            <DisplayIcon fontSize='1.2rem' color="white" />
        </ActionIcon>
    </Box >
}