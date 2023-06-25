import { useMemo, useEffect, useState } from "react";
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
  Button,
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
import { useCoupledState } from "../hooks/useCoupledState";
import { useClickOutside } from "@mantine/hooks";

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
    zIndex: 0,
    transition: {
      duration: 0.25,
    }
  },
  visible: {
    opacity: 1,
    zIndex: 10,
    transition: {
      duration: 0.25,
    }
  }
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

/**
 * Cat Breed Profile Page
 * @returns {JSX.Element}
 */
export function CatBreed() {
  const { breedId } = useParams();
  const { breed, error } = useBreed(breedId);
  const [emphasizeImage, setEmphasizeImage] = useState(false);
  const [carouselIndex, onChangeIndex] = useState(0);

  const onToggleImageEmphasis = (event) => {
    setEmphasizeImage((prev) => !prev);
  }

  /// Effect to scroll to top when breed changes
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  }, [breed]);

  /// Links for learning more on other sites
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

  /// Known for section
  const knownFor = <BreedKnownFors breed={breed} />

  /// Description section
  const description = (
    isNotEmptyString(breed?.description) && <MotionCard key='description' {...CardMotionProps} shadow="md" radius='lg' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Description</Text>
        <Text size='md' weight='normal'>{breed?.description}</Text>
      </Box>
    </MotionCard>
  );

  /// Also known as section
  const alsoKnownAs = (
    isNotEmptyString(breed?.alt_names) && <MotionCard key='alt_names' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Also known as</Text>
        <Text size='md' weight='normal' transform="capitalize">{breed?.alt_names}</Text>
      </Box>
    </MotionCard>
  );

  /// Temperament section
  const temperament = (
    isNotEmptyString(breed?.temperament) && <MotionCard key='temperament' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Temperament</Text>
        <Text size='md' weight='normal'>{breed?.temperament}</Text>
      </Box>
    </MotionCard>
  );

  /// Lifespan section
  const lifeSpan = (
    isNotEmptyString(breed?.life_span) && <MotionCard key='life_span' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Life Span</Text>
        <Text size='md' italic weight='normal'>{breed?.life_span} years</Text>
      </Box>
    </MotionCard>
  );

  /// Weight in standard units section
  const weightInStandard = (
    isNotEmptyString(breed?.weight.imperial) && <MotionCard key='weight' {...CardMotionProps} radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Weight</Text>
        <Text size='md' italic weight='normal'>{breed?.weight.imperial} lbs</Text>
      </Box>
    </MotionCard>
  )

  /// Badges section
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

  /// Title section
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

  const imagesUrls = useBreedImageUrl(breed?.id, 5);
  const referenceImage = useBreedReferenceImage(breed?.reference_image_id);
  const images = useMemo(() => {
    const images = {};
    for (const image of [referenceImage, imagesUrls].flat().filter(Boolean)) {
      if (image && image?.id) {
        images[image.id] = image;
      }
    }
    return Object.values(images);
  }, [imagesUrls, referenceImage]);

  /// Image section
  const carousel = breed && <Card
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
      <ImageCarousel
        images={images}
        onDoubleClick={onToggleImageEmphasis}
        emphasized={emphasizeImage}
        carouselIndex={carouselIndex}
        onChangeIndex={onChangeIndex}
      />
    </Card.Section>
  </Card>;

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
              <Grid.Col xs={12} sx={{ width: '100%', display: 'flex', flexDirection: "column", alignItems: emphasizeImage ? 'center' : 'start', gap: rem(16) }}>
                <Grid w='100%'>
                  <Grid.Col {...(emphasizeImage ? { xs: 12 } : { xs: 12, sm: 6, md: 5 })} sx={{ display: 'flex', flexDirection: "column", alignItems: 'start' }}>
                    <Grid gutter='none' grow sx={{ width: '100%', margin: '0 auto' }}>
                      <Grid.Col span={12}>
                        {carousel}
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

                  {
                    !emphasizeImage && <Grid.Col xs={12} sm='auto' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
                      {alsoKnownAs}
                      {description}
                      {temperament}
                      {knownFor}
                      <Space sx={{ flex: '1 1 auto' }} />
                      {learnMoreLinks}
                    </Grid.Col>
                  }
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

/**
 * Image Carousel for a given breed
 * @param {{
 *   breed: import('../APIs/cats').Breed,
 *   imagesUrls: string[],
 *   referenceImage: import('../APIs/cats').BreedImage,
 *   emphasized: boolean,
 *   carouselIndex: number,
 *   onChangeIndex: (index: number) => void,
 * }} props  
 * @returns {JSX.Element}
 */
function ImageCarousel({ images, onDoubleClick, emphasized, carouselIndex, onChangeIndex }) {
  const ref = useClickOutside(() => {
    if (emphasized) {
      onDoubleClick();
    }
  });

  const initialSlide = useMemo(() => carouselIndex, [emphasized]);

  /// Carousel Images
  const imageElements = useMemo(() => {
    return Object.values(images).map((image) => (
      <img
        key={image.id}
        src={image.url}
        alt={image.alt}
        loading='eager'
        style={{
          objectFit: "cover",
          height: '100%',
          width: '100%',
          position: 'absolute',
        }}
      />
    ))
  }, [images, emphasized]);

  return useMemo(() => (
    images.length > 0 ? (
      <Carousel
        loop
        ref={emphasized ? ref : null}
        key={`carousel_${emphasized}`}
        withIndicators
        onNextSlide={() => onChangeIndex((prev) => (prev + 1) % images.length)}
        onPreviousSlide={() => onChangeIndex((prev) => (prev - 1 + images.length) % images.length)}
        initialSlide={initialSlide}
        setCarouselIndex={onChangeIndex}
        sx={{
          width: '100%',
          height: '100%',
          aspectRatio: '1 / 1'
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
        {imageElements.map((image, index) => (
          <MotionCarouselSlide
            variants={CarouselVariants}
            onDoubleClick={onDoubleClick}
            exit='hidden'
            key={`img_${index}`}
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
    ) : <Stack align="center" justify="center" h='100%' w='100%' sx={{ aspectRatio: '1/1' }}>
      <EmptyBreedImage />
    </Stack>
  ), [imageElements, emphasized, carouselIndex]);
}