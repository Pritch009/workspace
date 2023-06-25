import { useMemo, useEffect } from "react";
import {
  Box,
  Title,
  Text,
  Card,
  rem,
  Tooltip,
  Grid,
  Alert,
  Badge,
  Stack,
  Space,
} from "@mantine/core";
import { useBreedImageUrl, useBreed, useBreedReferenceImage } from "../APIs/cats";
import { BsWikipedia } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { BreedKnownFors } from "./breedKnownFors";
import CfaLogo from '../assets/cfa-logo.png';
import VcaLogo from '../assets/vca-logo.png';
import VetstreetLogo from '../assets/vetstreet-logo-colored.webp';
import { SimilarBreeds } from "./similarBreeds";
import { EmptyBreedImage } from "./emptyBreedImage";
import { Carousel } from "@mantine/carousel";
import { NationalFlag } from "./nationalFlag";
import { isNotEmptyString } from "../utilities";
import { TraitBadge } from "./traitBadge";
import { IconLink, LinkLogo } from "./iconLink";
import { GoBackButton } from "./goBackButton";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

const TraitBadges = [
  { field: 'indoor', color: 'green', display: 'Indoor', hint: 'Indoor cats live best inside.' },
  { field: 'lap', color: 'orange', display: 'Lap Kitty', hint: 'Lap kitties love to sit on your lap.' },
  { field: 'hairless', color: 'purple', display: 'Hairless', hint: 'Hairless cats have very little to no hair.' },
  { field: 'rare', color: 'red', display: 'Rare', hint: 'Rare cats are difficult to acquire.' },
  { field: 'experimental', color: 'blue', display: 'Experimental', hint: 'Experimental cats do not have the recognition of any major national or international cat registries.' },
  { field: 'rex', color: 'green', display: 'Rex', hint: 'Rex cats have curly hair.' },
  { field: 'suppressed_tail', color: 'yellow', display: 'Suppressed Tail', hint: 'Suppressed tail cats have a short tail.' },
  { field: 'short_legs', color: 'pink', display: 'Short Legs', hint: 'Short legged cats have short legs.' },
  { field: 'hypoallergenic', color: 'teal', display: 'Hypoallergenic', hint: 'Hypoallergenic cats are less likely to cause allergic reactions.' },
  { field: 'natural', color: 'cyan', display: 'Natural', hint: 'Natural breeds have been found in nature.' },
];

const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionBox = motion(Box);
const MotionBadge = motion(Badge);
const MotionTraitBadge = motion(TraitBadge);
const MotionCarouselSlide = motion(Carousel.Slide);

const CarouselVariants = {
  hidden: {
    opacity: 0,
    zIndex: 5,
    transition: {
      duration: 0.15,
    }
  },
  visible: {
    opacity: 1,
    zIndex: 10,
    transition: {
      duration: 0.5,
    }
  }
}

export function CatBreed() {
  const { breedId } = useParams();
  const { breed, error } = useBreed(breedId);
  const imagesUrls = useBreedImageUrl(breedId, 5);
  const referenceImage = useBreedReferenceImage(breed?.reference_image_id)

  const images = useMemo(() => {
    const images = {};
    for (const image of [referenceImage, ...imagesUrls]) {
      if (image && image?.id) {
        images[image.id] = image;
      }
    }

    return Object.values(images).map((image) => (
      <img
        key={image.id}
        src={image.url}
        alt={`Image of ${breed?.name} cat.`}
        loading='eager'
        style={{
          objectFit: "cover",
          height: '100%',
          width: '100%',
          position: 'absolute',
        }}
      />
    ))
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  }, [breed]);

  const learnMoreLinks = (
    breed && (
      <MotionBox
        key='learn_more_links'
        {...CardMotionProps}
        sx={{ display: 'flex', alignItems: 'center', gap: rem(16), justifyContent: 'center', overflow: 'visible', flexWrap: 'wrap' }}
      >
        {breed?.wikipedia_url && <IconLink Icon={BsWikipedia} href={breed.wikipedia_url} label="Learn more on Wikipedia" />}
        {breed?.vetstreet_url && <IconLink Icon={() => <LinkLogo src={VetstreetLogo} alt="Vetstreet" />} href={breed.vetstreet_url} label="Learn more on Vetstreet" />}
        {breed?.vcahospitals_url && <IconLink Icon={() => <LinkLogo src={VcaLogo} alt="VCA Hospitals logo" />} href={breed.vcahospitals_url} label="Learn more on VCA Hospitals" />}
        {breed?.cfa_url && <IconLink Icon={() => <LinkLogo src={CfaLogo} alt="CFA Logo" style={{ filter: "invert(1)" }} />} href={breed.cfa_url} label="Learn more on CFA" />}
      </MotionBox>
    )
  );


  const knownFor = (
    <BreedKnownFors breed={breed} />
  )

  const description = (
    isNotEmptyString(breed?.description) && <MotionCard key='description' {...CardMotionProps} shadow="md" radius='lg' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Description</Text>
        <Text size='md' weight='normal'>{breed?.description}</Text>
      </Box>
    </MotionCard>
  );

  const alsoKnownAs = (
    isNotEmptyString(breed?.alt_names) && <MotionCard key='alt_names' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Also known as</Text>
        <Text size='md' weight='normal' transform="capitalize">{breed?.alt_names}</Text>
      </Box>
    </MotionCard>
  );

  const temperament = (
    isNotEmptyString(breed?.temperament) && <MotionCard key='temperament' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Temperament</Text>
        <Text size='md' weight='normal'>{breed?.temperament}</Text>
      </Box>
    </MotionCard>
  );

  const lifeSpan = (
    isNotEmptyString(breed?.life_span) && <MotionCard key='life_span' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Life Span</Text>
        <Text size='md' italic weight='normal'>{breed?.life_span} years</Text>
      </Box>
    </MotionCard>
  );

  const weightInStandard = (
    isNotEmptyString(breed?.weight.imperial) && <MotionCard key='weight' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Weight</Text>
        <Text size='md' italic weight='normal'>{breed?.weight.imperial} lbs</Text>
      </Box>
    </MotionCard>
  )

  const badges = (
    breed && <Box py={rem(16)} sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: rem(8), justifyContent: 'center' }}>
      <MotionBadge key='origin_badge' {...CardMotionProps} variant="outline" color='gray' size="lg" leftSection={<NationalFlag countryCode={breed?.country_code} />}>
        {breed?.origin ?? 'Unknown'}
      </MotionBadge>
      {
        TraitBadges.map(({ field, color, display, icon, hint }) => (
          <Tooltip key={field} label={hint} sx={{ '&:empty': { display: 'none' } }}>
            <MotionTraitBadge key={`trait_${field}`} {...CardMotionProps} value={breed[field]} color={color} display={display} leftSection={icon} />
          </Tooltip>
        ))
      }
    </Box>
  );
  const title = (
    breed && <Box
      py={rem(16)}
      sx={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        gridTemplateColumns: '1fr auto 1fr',
        gap: rem(16),
        width: '100%',
        position: 'relative',
      }}
    >
      <Box>
        <GoBackButton />
      </Box>
      <Title sx={{ fontSize: 'clamp(1rem, 7vw, 1.67rem)', textAlign: 'center' }}>{breed?.name}</Title>
    </Box>
  );


  const image = (
    breed && <Card
      key='carousel'
      radius='lg'
      shadow="md"
      sx={{
        position: 'relative',
        width: '100%',
        alignItems: 'start',
        aspectRatio: '1 / 1',
      }}
    >
      <Card.Section>
        <Stack align="center" justify="center" sx={{
          position: 'relative',
          width: '100%',
          height: 'auto',
          aspectRatio: '1 / 1',
        }}>
          {
            images.length >= 1 && (
              <Carousel
                loop
                withIndicators
                sx={{
                  width: '100%',
                  height: '100%',
                }}
                styles={{
                  viewport: {
                    height: '100%',
                    width: '100%',
                  },
                  container: {
                    height: '100%',
                    width: '100%',
                  }
                }}
              >
                {images.map((image, index) => (
                  <MotionCarouselSlide
                    variants={CarouselVariants}
                    exit='hidden'
                    key={`img_${index}`}
                    onClick={() => { }}
                    sx={{
                      display: 'block',
                      height: '100%',
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {image}
                  </MotionCarouselSlide>
                ))}
              </Carousel>
            )
          }
          {
            images.length === 0 && (
              <EmptyBreedImage />
            )
          }
        </Stack>
      </Card.Section>
    </Card>
  );

  return (
    <>
      <Box
        sx={{
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: rem(16),
          paddingRight: rem(16),
          paddingBottom: rem(48),
          overflow: 'hidden',
        }}
      >
        {error && <Alert color='red' title="Failed to load breed!">{error}</Alert>}
        <AnimatePresence>
          {breed && (
            <MotionGrid
              key={breed.id}
              initial='hidden'
              animate='visible'
              variants={GridVariants}
              sx={{ width: '100%', maxWidth: rem(1000), margin: '0 auto' }}
            >
              <Grid.Col span={12}>
                {title}
              </Grid.Col>
              <Grid.Col xs={12} sx={{ display: 'flex', flexDirection: "column", alignItems: 'start', gap: rem(16) }}>
                <Grid>
                  <Grid.Col xs={12} sm={6} md={5} sx={{ display: 'flex', flexDirection: "column", alignItems: 'start' }}>
                    <Grid gutter='none' grow sx={{ width: '100%', margin: '0 auto' }}>
                      <Grid.Col span={12}>
                        {image}
                        {badges}
                      </Grid.Col>
                      <Grid.Col>
                        <Grid grow>
                          <Grid.Col span={6}>
                            {lifeSpan}
                          </Grid.Col>
                          <Grid.Col span={6}>
                            {weightInStandard}
                          </Grid.Col>
                        </Grid>
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>
                  <Grid.Col xs={12} sm='auto' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
                    {alsoKnownAs}
                    {description}
                    {temperament}
                    {knownFor}
                    <Space sx={{ flex: '1 1 auto' }} />
                    {learnMoreLinks}
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </MotionGrid>
          )}
          <SimilarBreeds to={breed} />
        </AnimatePresence>
      </Box>
    </>
  );
}

const GridVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
}

const CardVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100,
      duration: 1
    }
  },
}

const CardMotionProps = {
  // initial: 'hidden',
  // whileInView: 'visible',
  variants: CardVariants,
}