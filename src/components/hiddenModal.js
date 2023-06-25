import { Box, Button, Flex, Modal, rem } from "@mantine/core";
import { useHideContext } from "../contexts/hideContext";
import { useEffect, useMemo, useState } from "react";
import { BreedLinkCard } from "./breedLinkCard";

export function HiddenModal() {
    const [hidden] = useHideContext();
    const [opened, setOpened] = useState(false);

    const someHidden = useMemo(() => hidden.size > 0, [hidden]);

    const onOpen = () => setOpened(true);
    const onClose = () => setOpened(false);

    useEffect(() => {
        if (!someHidden && opened) {
            setOpened(false);
        }
    }, [someHidden, opened]);

    return <>
        {someHidden && <Button onClick={onOpen} color='red'>Hidden ({hidden.size})</Button>}
        <Modal opened={opened} title={`Hidden Breeds (${hidden.size})`} onClose={onClose} maw={rem(2000)} w='100%'>
            <Flex gap='lg' wrap='wrap' justify='center' py={rem(16)}>
                {
                    Array.from(hidden.entries()).map(([id, breed]) => (
                        <Box key={id} sx={{ aspectRatio: '1/1', width: '150px' }}>
                            <BreedLinkCard breed={breed} ignoreHidden={true} />
                        </Box>
                    ))
                }
            </Flex>
        </Modal>
    </>
}