import { useMemo, Fragment } from "react";
import { BsFillHeartFill } from "react-icons/bs";
import { BiHomeSmile } from "react-icons/bi";
import { MdChildFriendly, MdEnergySavingsLeaf } from "react-icons/md";
import { FaDog, FaCat } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";
import { IoPeople } from "react-icons/io5";
import { GiHairStrands, GiComb, GiHealthNormal, GiBrain } from "react-icons/gi";
import { Box, rem, Card, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion/dist/framer-motion";

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

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const KnownForBadgeVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 10
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.15
        }
    },
};

/**
 * Displays properties of a breed that it is known for.
 * This are calculated using the min and max values of the breed's attributes.
 * @param {{
 *  breed: import('../APIs/cats').Breed
 * }} param0 
 * @returns {JSX.Element}
 */
export function BreedKnownFors({ breed }) {
    const theme = useMantineTheme();
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

        const MapToElement = ([sortKey, key], index) => {
            const attr = attributes[key];
            const Icon = attr.Icon;
            const display = attr.display[sortKey];
            let bg;
            if (attr.ambiguous) {
                bg = 'blue';
            } else {
                switch (sortKey) {
                    case 'high':
                        bg = 'green';
                        break;
                    case 'low':
                        bg = 'orange';
                        break;
                }
            }

            const element = display && (
                <MotionCard
                    key={`${breed?.id}_${key}`}
                    variants={KnownForBadgeVariants}
                    py={rem(8)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: rem(8),
                        flex: '0 0 auto',
                        backgroundColor: theme.colors[bg][3]
                    }}
                >
                    <Icon fontSize="1.15rem" />
                    <Text size='sm'>{display}</Text>
                </MotionCard>
            );

            return element;
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

        return [
            sorted['high'] ?? [],
            sorted['ambiguous'] ?? [],
            sorted['low'] ?? []
        ].flat().map(MapToElement);
    }, [breed]);

    return (
        <MotionBox variants={CardVariants} p={rem(16)} sx={{ display: 'flex', flexDirection: 'row', width: "100%", boxSizing: "border-box", justifyContent: 'center', alignItems: 'center', gap: rem(16), flexWrap: 'wrap' }}>
            {values}
        </MotionBox>
    );
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

const AttributeOrder = {
    Low: -1,
    High: 1,
    Middle: 0
}