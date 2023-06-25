import { Box, Stack } from "@mantine/core";
import { FaCat } from "react-icons/fa";

/**
 * Empty image to display if none is found
 * @returns {JSX.Element}
 */
export function EmptyBreedImage() {
    return <Stack align='center' justify='center' w='100%' sx={{ svg: { height: '80%', width: '80%' } }}>
        <FaCat />
    </Stack>
}