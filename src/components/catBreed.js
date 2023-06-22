import { useMemo, Fragment } from "react";
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
} from "@mantine/core";
import { useBreedImageUrl, useBreed } from "../APIs/cats";
import { BsWikipedia, BsFillHeartFill } from "react-icons/bs";
import { BiHomeSmile } from "react-icons/bi";
import { MdArrowBack, MdChildFriendly, MdEnergySavingsLeaf } from "react-icons/md";
import { FaDog, FaCat, FaSmileBeam } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import { GiHairStrands, GiComb, GiHealthNormal, GiBrain } from "react-icons/gi";
import { useParams, useNavigate } from "react-router-dom";

export function CatBreed() {
  const { breedId } = useParams();
  const { breed, error } = useBreed(breedId);
  const imageUrl = useBreedImageUrl(breedId);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Box
        p={rem(16)}
        sx={{
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Button variant='outline' leftIcon={<MdArrowBack />} onClick={goBack}>Back</Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: rem(16),
          paddingBottom: rem(16),
        }}
      >
        {error && <Alert title="Failed to load breed!">{error}</Alert>}
        {breed && (
          <>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`Image of ${breed.name} cat.`}
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  objectFit: "cover",
                }}
              />
            )}
            <Title py={16}>{breed?.name}</Title>
            <Card>
              <Text>{breed.description}</Text>
            </Card>

            <BreedKnownFors breed={breed} />
            <WikipediaLink breed={breed} />
          </>
        )}
      </Box>
    </>
  );
}

function WikipediaLink({ breed }) {
  return (
    <Box
      component="a"
      href={breed.wikipedia_url}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: rem(8),
        textDecoration: "none",
      }}
    >
      <BsWikipedia />
      <Text>View on Wikipedia</Text>
    </Box>
  );
}

const attributes = {
  adaptability: {
    display: {
      high: "Adapts Well",
      low: "Does not Adapt Well",
    },
    Icon: BiHomeSmile,
  },
  affection_level: {
    display: {
      high: "Very Affectionate",
      low: "Independent",
    },
    Icon: BsFillHeartFill,
    ambiguous: true
  },
  child_friendly: {
    display: {
      high: "Child Friendly",
      low: "Not Child Friendly",
    },
    Icon: MdChildFriendly,
  },
  dog_friendly: {
    display: {
      high: "Dog Friendly",
      low: "Not Dog Friendly",
    },
    Icon: FaDog,
  },
  energy_level: {
    display: {
      high: "High Energy",
      low: "Low Energy",
    },
    Icon: MdEnergySavingsLeaf,
    ambiguous: true
  },
  grooming: {
    display: {
      high: "Self Maintaining",
      low: "Needs lots of Grooming",
    },
    Icon: GiComb,
    inverse: true
  },
  health_issues: {
    display: {
      high: undefined,
      low: "Prone to health issues",
    },
    Icon: GiHealthNormal,
    inverse: true
  },
  intelligence: {
    display: {
      high: "Intelligent",
      low: undefined,
    },
    Icon: GiBrain,
  },
  shedding_level: {
    display: {
      high: "Little Shedding",
      low: "Sheds a lot",
    },
    Icon: GiHairStrands,
    inverse: true
  },
  social_needs: {
    display: {
      high: "Social",
      low: "Not Social",
    },
    Icon: FaCat,
  },
  stranger_friendly: {
    display: {
      high: "Stranger Friendly",
      low: "Not Stranger Friendly",
    },
    Icon: IoPeople,
  },
  vocalisation: {
    display: {
      high: "Vocal",
      low: "Quiet",
    },
    Icon: RiKakaoTalkFill,
    ambiguous: true
  },
};

function BreedKnownFors({ breed }) {
  const values = useMemo(() => {
    const values = Object.entries(breed).filter(
      ([key, value]) => key in attributes
    );

    const highest = Math.max(
      4,
      values.reduce(
        (acc, [key, value]) => (value > acc ? value : acc), 0
      )
    )

    const findSortKey = (attr, value) => {
      const [low, high] = Boolean(attr.inverse) ? ['high', 'low'] : ['low', 'high'];
      return (value === 1) ? low : high;
    }

    const MapToElement = ([sortKey, key]) => {
      const attr = attributes[key];
      const Icon = attr.Icon;
      const display = attr.display[sortKey];
      let bg;
      if (attr.ambiguous) {
        bg = 'yellow';
      } else {
        switch (sortKey) {
          case 'high':
            bg = 'green';
            break;
          case 'low':
            bg = 'red';
            break;
        }
      }

      console.log(sortKey, key, display, bg);

      const element = display && (
        <Card
          bg={bg}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: rem(8),
          }}
        >
          <Icon />
          <Text>{display}</Text>
        </Card>
      );

      return [key, element];
    };

    const allowed = values
      .filter(([_, value]) => value === highest || value === 1);

    const sorted = {};
    for (const [key, value] of allowed) {
      const attr = attributes[key];
      const sortKey = findSortKey(attr, value);
      const sortedKey = attr.ambiguous ? 'ambiguous' : sortKey;
      // Get the array of values for this key, or create a new one
      const arr = sorted[sortedKey] ?? [];
      arr.push([sortKey, key]);

      if (!(sortedKey in sorted)) {
        sorted[sortedKey] = arr;
      }
    }

    console.log(sorted);

    return [
      sorted['high'] ?? [],
      sorted['ambiguous'] ?? [],
      sorted['low'] ?? []
    ].flat().map(MapToElement);
  }, [breed]);

  return (
    <Box py={rem(32)} sx={{ display: 'flex', flexDirection: 'column', width: "100%", boxSizing: "border-box", justifyContent: 'center', gap: rem(16) }}>
      {values.map(([key, value]) => (
        <Fragment key={key}>
          {value}
        </Fragment>
      ))}
    </Box>
  );
}

const AttributeOrder = {
  Low: -1,
  High: 1,
  Middle: 0
}