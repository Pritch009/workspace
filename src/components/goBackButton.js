import { useNavigate } from "react-router-dom";
import { ActionIcon, Box, Button } from "@mantine/core";
import { MdArrowBack } from "react-icons/md";
import { useViewportSize } from "@mantine/hooks";

export function GoBackButton() {
    const navigate = useNavigate();
    const { width: screenWidth } = useViewportSize();

    const goBack = () => {
        navigate('/');
    };

    return (
        <Box
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
                        onClick={goBack}>
                        Back
                    </Button>
                    : <ActionIcon
                        variant='outline'
                        onClick={goBack}
                    >
                        <MdArrowBack />
                    </ActionIcon>
            }
        </Box>
    );
}
