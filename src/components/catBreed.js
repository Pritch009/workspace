import { useMemo, Fragment, forwardRef, useEffect } from "react";
import {
  Box,
  Title,
  Text,
  Card,
  rem,
  Tooltip,
  Grid,
  Alert,
  Button,
  Badge,
  ActionIcon,
  Container,
  Stack,
  Space,
} from "@mantine/core";
import { useBreedImageUrl, useBreed } from "../APIs/cats";
import { BsWikipedia, BsFillHeartFill } from "react-icons/bs";
import { BiHomeSmile } from "react-icons/bi";
import { MdArrowBack, MdChildFriendly, MdEnergySavingsLeaf } from "react-icons/md";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BreedKnownFors } from "./breedKnownFors";
import CfaLogo from '../assets/cfa-logo.png';
import VcaLogo from '../assets/vca-logo.png';
import VetstreetLogo from '../assets/vetstreet-logo-colored.webp';
import { useViewportSize } from "@mantine/hooks";
import { SimilarBreeds } from "./similarBreeds";
import { EmptyBreedImage } from "./emptyBreedImage";
import { Carousel } from "@mantine/carousel";
import { NationalFlag } from "./nationalFlag";

export function CatBreed() {
  const { breedId } = useParams();
  const { breed, error } = useBreed(breedId);
  const images = useBreedImageUrl(breedId, 5).slice(0, 5);
  const navigate = useNavigate();
  const { width: screenWidth } = useViewportSize();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  }, [breed]);

  const goBack = () => {
    navigate('/');
  };

  const learnMoreLinks = (
    breed && <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(16), justifyContent: 'center', overflow: 'visible', flexWrap: 'wrap' }}>
      {breed?.wikipedia_url && <IconLink Icon={BsWikipedia} href={breed.wikipedia_url} label="Learn more on Wikipedia" />}
      {breed?.vetstreet_url && <IconLink Icon={() => <LinkLogo src={VetstreetLogo} alt="Vetstreet" />} href={breed.vetstreet_url} label="Learn more on Vetstreet" />}
      {breed?.vcahospitals_url && <IconLink Icon={() => <LinkLogo src={VcaLogo} alt="VCA Hospitals logo" />} href={breed.vcahospitals_url} label="Learn more on VCA Hospitals" />}
      {breed?.cfa_url && <IconLink Icon={() => <LinkLogo src={CfaLogo} alt="CFA Logo" style={{ filter: "invert(1)" }} />} href={breed.cfa_url} label="Learn more on CFA" />}
    </Box>
  )

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
  ]

  const LinkLogo = ({ alt, src, ...props }) => <img src={src} alt={alt} height={30} width='auto' {...props} />;

  const backButton = (
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

  const knownFor = (
    <BreedKnownFors breed={breed} />
  )

  const description = (
    <Card shadow="md" radius='lg' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      {
        breed?.description && <Box>
          <Text size='xs' transform='uppercase'>Description</Text>
          <Text size='md' weight='normal' transform="capitalize">{breed?.description}</Text>
        </Box>
      }
    </Card>
  );

  const alsoKnownAs = (
    (breed?.alt_names?.trim?.()?.length ?? 0) > 0 && <Card radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Also known as</Text>
        <Text size='md' weight='normal' transform="capitalize">{breed?.alt_names}</Text>
      </Box>
    </Card>
  );

  const temperament = (
    (breed?.temperament?.trim?.()?.length ?? 0) > 0 && <Card radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Temperament</Text>
        <Text size='md' weight='normal'>{breed?.temperament}</Text>
      </Box>
    </Card>
  )

  const lifeSpan = (
    breed?.life_span && <Card radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Life Span</Text>
        <Text size='md' italic weight='normal'>{breed?.life_span} years</Text>
      </Box>
    </Card>
  )

  const weightInStandard = (
    breed?.weight && <Card radius='md' shadow='md' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Weight</Text>
        <Text size='md' italic weight='normal'>{breed?.weight.imperial} lbs</Text>
      </Box>
    </Card>
  );

  const badges = (
    breed && <Box py={rem(16)} sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: rem(8), justifyContent: 'center' }}>
      <Badge variant="outline" color='gray' size="lg" leftSection={<NationalFlag countryCode={breed?.country_code} />}>
        {breed?.origin}
      </Badge>
      {
        TraitBadges.map(({ field, color, display, icon, hint }) => (
          <Tooltip key={field} label={hint}>
            <Box sx={{ display: 'flex', '&:empty': { display: 'none' } }}>
              <TraitBadge value={breed[field]} color={color} display={display} leftSection={icon} />
            </Box>
          </Tooltip>
        ))
      }
    </Box>
  )

  const image = (
    breed && <Card
      radius='lg'
      shadow="md"
      sx={{
        width: '100%',
        alignItems: 'start',
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
            images.length > 1 && (
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
                  <Carousel.Slide
                    onClick={() => { }}
                    key={image.url}
                    sx={{
                      display: 'block',
                      height: '100%',
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Image of ${breed?.name} cat.`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      style={{
                        objectFit: "cover",
                        height: '100%',
                        width: '100%',
                        position: 'absolute'
                      }}
                    />
                  </Carousel.Slide>
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
      <Box sx={{}}>
        {backButton}
      </Box>
      <Title sx={{ fontSize: 'clamp(1rem, 7vw, 1.67rem)', textAlign: 'center' }}>{breed?.name}</Title>
      <Box />
    </Box>
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
        {breed && (
          <Grid sx={{ width: '100%', maxWidth: rem(1000), margin: '0 auto' }}>
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
          </Grid>
        )}
        <SimilarBreeds to={breed} />
      </Box>
    </>
  );
}

function TraitBadge({ value: _value, color, display, invert = false, leftSection }) {
  const value = _value && _value === (Boolean(invert) ? 0 : 1);
  if (!value) {
    return null;
  }

  return <Badge size='lg' leftSection={leftSection} styles={{ leftSection: { display: 'flex' } }} color={color}>
    {display}
  </Badge>
}

function IconLink({ Icon, href, label }) {
  return (
    <Tooltip label={label}>
      <Button
        variant="outline"
        component={Link}
        radius={100}
        to={href}
        size='lg'
        bg='white'
        sx={{
          textDecoration: "none",
        }}
      >
        <Icon fontSize={rem(18)} />
      </Button>
    </Tooltip>
  );
}
