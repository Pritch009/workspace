import { Card, Text } from "@mantine/core";
import { useBreedImageUrl } from "../APIs/cats";
import { Link } from "react-router-dom";

export function BreedLinkCard({ breed }) {
    const image = useBreedImageUrl(breed.id);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return <Card component={Link} onClick={scrollToTop} to={`/breed/${breed.id}`} display='flex' shadow='sm' radius='md' w="100%" h='100%' >
        <Card.Section sx={{
            height: 'min-content', display: 'flex', flex: '1 1 auto',
            height: '100%',
            width: '100%',
            '& > img': {
                height: '100%',
                width: '100%',
            }
        }}>
            {image && (
                <img
                    src={image}
                    alt={`Image of ${breed?.name} cat.`}
                    style={{
                        position: "absolute",
                        objectFit: "cover",
                    }}
                />
            )}
            <Text sx={{ width: '100%', textAlign: 'center', position: 'absolute', bottom: 0, left: 0, zIndex: 1, background: '#ffffffA0', backdropFilter: 'blur(3px)' }}>{breed?.name}</Text>
        </Card.Section>
    </Card>
}