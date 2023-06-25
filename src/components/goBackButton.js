import { Link, useNavigate } from "react-router-dom";
import { ActionIcon, Box, Button } from "@mantine/core";
import { MdArrowBack } from "react-icons/md";
import { useViewportSize } from "@mantine/hooks";

/**
 * Since this is only 2 pages (browse and view breed),
 * This is a simple button to go back to the browse page
 * @returns {JSX.Element}
 */
export function GoBackButton() {
    const navigate = useNavigate();
    const { width: screenWidth } = useViewportSize();

    return (
        <Box
            component={Link}
            to='/'
            sx={{
                flex: '1 1 auto',
                boxSizing: 'border-box'
            }}
        >
            {
                screenWidth > 400
                    ? <Button
                        size='sm'
                        variant='outline'
                        leftIcon={<MdArrowBack />}
                        type="button"
                    >
                        Back
                    </Button>
                    : <ActionIcon
                        variant='outline'
                        type='button'
                    >
                        <MdArrowBack />
                    </ActionIcon>
            }
        </Box>
    );
}
