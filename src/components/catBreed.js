import { useMemo } from "react";
import { Box, Title, Text, Card, rem, Tooltip, Grid } from "@mantine/core";
import { useBreedImageUrl } from "../APIs/cats";
import { BsWikipedia, BsFillHeartFill } from "react-icons/bs";
import { BiHomeSmile } from "react-icons/bi";
import { MdChildFriendly, MdEnergySavingsLeaf } from "react-icons/md";
import { FaDog, FaCat } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import { GiHairStrands, GiComb, GiHealthNormal, GiBrain } from "react-icons/gi";

export function CatBreed({ breed }) {
  const imageUrl = useBreedImageUrl(breed.id);

  return (
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
    </Box>
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
    display: "Adaptable",
    Icon: BiHomeSmile,
  },
  affection_level: {
    display: "Affectionate",
    Icon: BsFillHeartFill,
  },
  child_friendly: {
    display: "Child Friendly",
    Icon: MdChildFriendly,
  },
  dog_friendly: {
    display: "Dog Friendly",
    Icon: FaDog,
  },
  energy_level: {
    display: "High Energy",
    Icon: MdEnergySavingsLeaf,
  },
  grooming: {
    display: "Groomable",
    Icon: GiComb,
  },
  health_issues: {
    display: "Health Issues",
    Icon: GiHealthNormal,
  },
  intelligence: {
    display: "Intelligent",
    Icon: GiBrain,
  },
  shedding_level: {
    display: "Shedding",
    Icon: GiHairStrands,
  },
  social_needs: {
    display: "Social Needs",
    Icon: FaCat,
  },
  stranger_friendly: {
    display: "Stranger Friendly",
    Icon: IoPeople,
  },
  vocalisation: {
    display: "Vocal",
    Icon: RiKakaoTalkFill,
  },
};

function BreedKnownFors({ breed }) {
  const { highs, lows } = useMemo(() => {
    const values = Object.entries(breed).filter(
      ([key, value]) => key in attributes
    );
    return {
      highs: values.filter(([_, value]) => value === 5),
      lows: values.filter(([_, value]) => value === 1),
    };
  }, [breed]);

  return (
    <Grid spacing={32} py={32} sx={{ width: "100%", boxSizing: "border-box" }}>
      <Grid.Col span={6}>
        <Card sx={{ width: "100%" }} bg="green">
          <Title order={4}>Best Known For</Title>
          {highs.map(([key]) => {
            const attr = attributes[key];
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: rem(8),
                }}
                py={8}
              >
                <attr.Icon fontSize={rem(24)} />
                <Text>{attr.display}</Text>
              </Box>
            );
          })}
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card sx={{ width: "100%" }} bg="red">
          <Title order={4}>Least Known For</Title>
          {lows.map(([key]) => {
            const attr = attributes[key];
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: rem(8),
                }}
                py={8}
              >
                <attr.Icon fontSize={rem(24)} />
                <Text>{attr.display}</Text>
              </Box>
            );
          })}
        </Card>
      </Grid.Col>
    </Grid>
  );
}
