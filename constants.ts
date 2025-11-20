
import { Weapon, Aspect } from './types';

export const WEAPONS: Weapon[] = [
  {
    id: 'staff',
    name: "Witch's Staff",
    iconName: 'Staff',
    description: 'Descura. Fast strikes, ranged specials. Good for Omega moves and reliable damage.',
  },
  {
    id: 'blades',
    name: 'Sister Blades',
    iconName: 'Scissors',
    description: 'Lim and Oros. Rapid close-range attacks, backstab bonuses, and spread-fire specials.',
  },
  {
    id: 'axe',
    name: 'Moonstone Axe',
    iconName: 'Axe',
    description: 'Zorephet. Heavy, high-damage strikes, blocking moves, and powerful whirlwind attacks.',
  },
  {
    id: 'flames',
    name: 'Umbral Flames',
    iconName: 'Flame',
    description: 'Ygnium. Ranged orbiting projectiles. Supports evasive kiting playstyles.',
  },
  {
    id: 'skull',
    name: 'Argent Skull',
    iconName: 'Skull',
    description: 'Revaal. Explosive shells that must be retrieved. Hybrid melee/ranged playstyle.',
  },
  {
    id: 'coat',
    name: 'Black Coat',
    iconName: 'Shield',
    description: 'Xinth. Defensive armament. Powerful counters, blocking, and homing missiles.',
  },
];

export const ASPECTS: Record<string, Aspect[]> = {
  staff: [
    { id: 'melinoe_staff', weaponId: 'staff', name: 'Aspect of Melinoë', description: 'Faster channel speed. Specials deal more damage.' },
    { id: 'circe', weaponId: 'staff', name: 'Aspect of Circe', description: 'Gain Serenity after hits to restore Magick and speed up Omega moves.' },
    { id: 'momus', weaponId: 'staff', name: 'Aspect of Momus', description: 'Omega Moves fire automatically in place up to 3 times.' },
    { id: 'anubis', weaponId: 'staff', name: 'Aspect of Anubis', description: 'Attacks place Fields, Specials drag foes. Lone Shades aid you.', hidden: true },
  ],
  blades: [
    { id: 'melinoe_blades', weaponId: 'blades', name: 'Aspect of Melinoë', description: 'Backstab damage increased significantly.' },
    { id: 'artemis', weaponId: 'blades', name: 'Aspect of Artemis', description: 'Omega Attack Parries and Ripostes for critical damage.' },
    { id: 'pan', weaponId: 'blades', name: 'Aspect of Pan', description: 'Specials seek foes inside your Cast effects. Fires more shots.' },
    { id: 'morrigan', weaponId: 'blades', name: 'Aspect of the Morrigan', description: 'Attacks hit 3 times. Special fires repeatedly. Blood Triad combo.', hidden: true },
  ],
  axe: [
    { id: 'melinoe_axe', weaponId: 'axe', name: 'Aspect of Melinoë', description: 'Increases Attack Power and Max Life.' },
    { id: 'charon', weaponId: 'axe', name: 'Aspect of Charon', description: 'Cast erupts like Omega Cast if struck by Omega Special.' },
    { id: 'thanatos', weaponId: 'axe', name: 'Aspect of Thanatos', description: 'Attacks are faster. Grants Mortality (Crit Chance) on hit.' },
    { id: 'nergal', weaponId: 'axe', name: 'Aspect of Nergal', description: 'Rock Lion Mace. Berserk state increases speed and heals on hit.', hidden: true },
  ],
  flames: [
    { id: 'melinoe_flames', weaponId: 'flames', name: 'Aspect of Melinoë', description: 'Attacks and Specials can deal Critical Damage.' },
    { id: 'moros', weaponId: 'flames', name: 'Aspect of Moros', description: 'Attacks linger and explode when struck by Specials.' },
    { id: 'eos', weaponId: 'flames', name: 'Aspect of Eos', description: 'Omega Attack fires a Daybreaker that copies Specials and pulses damage.' },
    { id: 'supay', weaponId: 'flames', name: 'Aspect of Supay', description: 'Devil Sparks. Auto-fire Attacks/Specials. Enhances Rush Boons.', hidden: true },
  ],
  skull: [
    { id: 'melinoe_skull', weaponId: 'skull', name: 'Aspect of Melinoë', description: 'Attacks have more Power for each unretrieved Shell.' },
    { id: 'medea', weaponId: 'skull', name: 'Aspect of Medea', description: 'Attack stays close/charges. Explodes on Special or timeout.' },
    { id: 'persephone', weaponId: 'skull', name: 'Aspect of Persephone', description: 'Omega Special is Sprouted (longer duration/control). Glory mechanic.' },
    { id: 'hel', weaponId: 'skull', name: 'Aspect of Hel', description: 'Frost Mane. Burst fire Attacks. Specials seek foes. Valkyrie form.', hidden: true },
  ],
  coat: [
    { id: 'melinoe_coat', weaponId: 'coat', name: 'Aspect of Melinoë', description: 'Attacks, Sprint, and Move Speed are faster.' },
    { id: 'selene', weaponId: 'coat', name: 'Aspect of Selene', description: 'Gain Sky Fall Hex. Dash-Strikes trigger Hex effects.' },
    { id: 'nyx', weaponId: 'coat', name: 'Aspect of Nyx', description: 'Omega Sprint creates a Nightspawn decoy that attacks.' },
    { id: 'shiva', weaponId: 'coat', name: 'Aspect of Shiva', description: 'Purifying Grace. Omega Attack hurtles forward. Destructive meter.', hidden: true },
  ],
};
