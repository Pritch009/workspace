import { Card, Text } from "@mantine/core";
import { useBreedImageUrl } from "../APIs/cats";
import { Link } from "react-router-dom";
import { EmptyBreedImage } from "./emptyBreedImage";

export function BreedLinkCard({ breed }) {
    const [image] = useBreedImageUrl(breed.id);

    return <Card component={Link} to={`/breed/${breed.id}`} display='flex' shadow='sm' radius='md' w="100%" h='100%' maw={350} mah={350} >
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
        </Card.Section>
    </Card>
}