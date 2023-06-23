import { useMemo, Fragment, forwardRef } from "react";
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
} from "@mantine/core";
import { useBreedImageUrl, useBreed } from "../APIs/cats";
import { BsWikipedia, BsFillHeartFill } from "react-icons/bs";
import { BiHomeSmile } from "react-icons/bi";
import { MdArrowBack, MdChildFriendly, MdEnergySavingsLeaf } from "react-icons/md";
import { FaDog, FaCat, FaSmileBeam, FaLeaf, FaCouch } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import { GiHairStrands, GiComb, GiHealthNormal, GiBrain } from "react-icons/gi";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BreedKnownFors } from "./breedKnownFors";
import CfaLogo from '../assets/cfa-logo.png';
import VcaLogo from '../assets/vca-logo.png';
import VetstreetLogo from '../assets/vetstreet-logo-colored.webp';
import { useViewportSize } from "@mantine/hooks";

export function CatBreed() {
  const { breedId } = useParams();
  const { breed, error } = useBreed(breedId);
  const imageUrl = useBreedImageUrl(breedId);
  const navigate = useNavigate();
  const { width: screenWidth } = useViewportSize();

  const goBack = () => {
    navigate('/');
  };

  const learnMoreLinks = (
    breed && <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(16), justifyContent: 'center', overflow: 'visible' }}>
      {breed?.wikipedia_url && <IconLink Icon={BsWikipedia} href={breed.wikipedia_url} label="Learn more on Wikipedia" />}
      {breed?.vetstreet_url && <IconLink Icon={() => <LinkLogo src={VetstreetLogo} alt="Vetstreet" />} href={breed.vetstreet_url} label="Learn more on Vetstreet" />}
      {breed?.vcahospitals_url && <IconLink Icon={() => <LinkLogo src={VcaLogo} alt="VCA Hospitals logo" />} href={breed.vcahospitals_url} label="Learn more on VCA Hospitals" />}
      {breed?.cfa_url && <IconLink Icon={() => <LinkLogo src={CfaLogo} alt="CFA Logo" style={{ filter: "invert(1)" }} />} href={breed.cfa_url} label="Learn more on CFA" />}
    </Box>
  )

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
    <Card bg='green' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      {
        breed?.description && <Box>
          <Text size='xs' transform='uppercase'>Description</Text>
          <Text size='md' italic weight='normal' transform="capitalize">{breed?.description}</Text>
        </Box>
      }
    </Card>
  );

  const alsoKnownAs = (
    breed?.alt_names && <Card bg='green' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Also known as</Text>
        <Text size='md' italic weight='normal' transform="capitalize">{breed?.alt_names}</Text>
      </Box>
    </Card>
  );

  const temperament = (
    breed?.temperament && <Card bg='green' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Temperament</Text>
        <Text size='md' italic weight='normal'>{breed?.temperament}</Text>
      </Box>
    </Card>
  )

  const lifeSpan = (
    breed?.life_span && <Card bg='green' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Life Span</Text>
        <Text size='md' italic weight='normal'>{breed?.life_span} years</Text>
      </Box>
    </Card>
  )

  const weightInStandard = (
    breed?.weight && <Card bg='green' sx={{ display: 'flex', flexDirection: 'column', gap: rem(16), padding: rem(32) }}>
      <Box>
        <Text size='xs' transform='uppercase'>Weight</Text>
        <Text size='md' italic weight='normal'>{breed?.weight.imperial} lbs</Text>
      </Box>
    </Card>
  );
  const badges = (
    breed && <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: rem(8), marginTop: rem(12) }}>
      <Badge variant="outline" color='gray' size="lg" leftSection={<NationalFlag countryCode={breed?.country_code} />}>
        {breed?.origin}
      </Badge>
      <TraitBadge value={breed.indoor} color='green' display='Indoor' leftSection={<FaCouch fontSize={rem(16)} />} />
      <TraitBadge value={breed.lap} color='orange' display='Lap Kitty' />
      <TraitBadge value={breed.hairless} color='purple' display='Hairless' />
      <TraitBadge value={breed.rare} color='red' display='Rare' />
      <TraitBadge value={breed.experimental} color='blue' display='Experimental' />
      <TraitBadge value={breed.rex} color='green' display='Rex' />
      <TraitBadge value={breed.suppressed_tail} color='yellow' display='Suppressed Tail' />
      <TraitBadge value={breed.short_legs} color='pink' display='Short Legs' />
      <TraitBadge value={breed.hypoallergenic} color='teal' display='Hypoallergenic' />
      <TraitBadge value={breed.natural} color='cyan' display='Natural' />
    </Box>
  )

  const image = (
    breed && <Card
      sx={{
        width: '100%',
        alignItems: 'start',
      }}
    >
      <Card.Section>
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: 'auto',
          aspectRatio: '4/3',
        }}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`Image of ${breed?.name} cat.`}
              style={{
                objectFit: "cover",
                height: '100%',
                width: '100%',
                position: 'absolute',
              }}
            />
          )}
        </Box>
      </Card.Section>
      {badges}
    </Card>
  );

  const title = (
    breed && <Box
      sx={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        gridTemplateColumns: '1fr auto 1fr',
        gap: rem(8),
        width: '100%',
        position: 'relative',
      }}
    >
      <Box sx={{}}>
        {backButton}
      </Box>
      <Title sx={{ fontSize: 'clamp(1rem, 10vw, 2rem)' }}>{breed?.name}</Title>
      <Box />
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: rem(1000),
          margin: 'auto',
          paddingBottom: rem(48)
        }}
      >
        {error && <Alert title="Failed to load breed!">{error}</Alert>}
        {breed && (
          <Grid>
            <Grid.Col span={12}>
              {title}
            </Grid.Col>
            <Grid.Col xs={12} sm={6} md={4} xl={3} sx={{ display: 'flex', flexDirection: "column", alignItems: 'start', gap: rem(16) }}>
              {image}
              {description}
            </Grid.Col>
            <Grid.Col xs={12} sm='auto' sx={{ display: 'flex', flexDirection: "column", gap: rem(16) }}>
              <Grid>
                <Grid.Col span={6}>
                  {lifeSpan}
                </Grid.Col>
                <Grid.Col span={6}>
                  {weightInStandard}
                </Grid.Col>
              </Grid>
              {alsoKnownAs}
              {temperament}
              {knownFor}
              {learnMoreLinks}
            </Grid.Col>
          </Grid>
        )}
      </Box>
    </>
  );
}

function TraitBadge({ value: _value, color, display, invert = false, leftSection }) {
  const value = _value && _value === (Boolean(invert) ? 0 : 1);
  console.log(value, color, display);
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

const NationalFlag = forwardRef(
  function NationalFlag({ countryCode, sx, ...props }, ref) {
    // given a country code, return the flag as an unicode emoji
    const flag = useMemo(() => {
      switch (countryCode) {
        case 'AU':
          return '🇦🇺';
        case 'CA':
          return '🇨🇦';
        case 'CN':
          return '🇨🇳';
        case 'DK':
          return '🇩🇰';
        case 'FR':
          return '🇫🇷';
        case 'DE':
          return '🇩🇪';
        case 'IT':
          return '🇮🇹';
        case 'JP':
          return '🇯🇵';
        case 'KR':
          return '🇰🇷';
        case 'NL':
          return '🇳🇱';
        case 'NZ':
          return '🇳🇿';
        case 'NO':
          return '🇳🇴';
        case 'ES':
          return '🇪🇸';
        case 'SE':
          return '🇸🇪';
        case 'TR':
          return '🇹🇷';
        case 'GB':
          return '🇬🇧';
        case 'US':
          return '🇺🇸';
        case 'EG':
          return '🇪🇬';
        case 'RU':
          return '🇷🇺';
        case 'TH':
          return '🇹🇭';
        case 'CH':
          return '🇨🇭';
        case 'AT':

          return '🇦🇹';
        case 'BG':
          return '🇧🇬';
        case 'HR':
          return '🇭🇷';
        case 'CZ':
          return '🇨🇿';
        case 'FI':
          return '🇫🇮';
        case 'GR':
          return '🇬🇷';

        case 'HU':
          return '🇭🇺';
        case 'ID':
          return '🇮🇩';
        case 'IE':
          return '🇮🇪';
        case 'IL':
          return '🇮🇱';
        case 'IN':
          return '🇮🇳';
        case 'MY':
          return '🇲🇾';
        case 'PL':
          return '🇵🇱';
        case 'PT':
          return '🇵🇹';
        case 'RO':
          return '🇷🇴';
        case 'RS':
          return '🇷🇸';
        case 'SG':
          return '🇸🇬';
        case 'SI':
          return '🇸🇮';
        case 'SK':
          return '🇸🇰';
        case 'UA':
          return '🇺🇦';
        case 'ZA':

          return '🇿🇦';
        case 'VN':
          return '🇻🇳';
        case 'BH':
          return '🇧🇭';
        case 'CY':
          return '🇨🇾';
        case 'EE':
          return '🇪🇪';
        case 'HK':
          return '🇭🇰';
        case 'IS':
          return '🇮🇸';
        case 'JO':
          return '🇯🇴';
        case 'KW':
          return '🇰🇼';

        case 'LB':
          return '🇱🇧';
        case 'LU':
          return '🇱🇺';
        case 'MT':
          return '🇲🇹';
        case 'MX':
          return '🇲🇽';
        case 'MC':
          return '🇲🇨';
        case 'OM':
          return '🇴🇲';
        case 'PH':
          return '🇵🇭';
        case 'PR':
          return '🇵🇷';
        case 'QA':
          return '🇶🇦';
        case 'SA':
          return '🇸🇦';
        case 'AE':
          return '🇦🇪';
        case 'UY':
          return '🇺🇾';
        case 'VE':
          return '🇻🇪';
        case 'AD':
          return '🇦🇩';
        case 'AG':
          return '🇦🇬';
        case 'AI':
          return '🇦🇮';
        case 'AL':
          return '🇦🇱';
        case 'AM':
          return '🇦🇲';
        case 'AO':
          return '🇦🇴';
        case 'AQ':
          return '🇦🇶';
        case 'AR':
          return '🇦🇷';
        case 'AW':
          return '🇦🇼';
        case 'AZ':
          return '🇦🇿';
        case 'BB':
          return '🇧🇧';
        case 'BD':
          return '🇧🇩';
        case 'BE':
          return '🇧🇪';
        case 'BF':
          return '🇧🇫';

        default:
          return countryCode;
      }
    }, [countryCode]);
    return <Text ref={ref} {...props} sx={[sx, {
      fontSize: rem(24), lineHeight: 'normal'
    }]}>{flag}</Text>
  }
);