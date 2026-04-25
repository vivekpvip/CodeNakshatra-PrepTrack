export const neetSyllabus = {
  id: 'neet',
  name: 'NEET UG',
  papers: [
    {
      id: 'neet.physics',
      name: 'Physics',
      subjects: [
        {
          id: 'neet.physics.mechanics',
          name: 'Mechanics',
          topics: [
            { id: 'neet.physics.mechanics.units', name: 'Units & Measurements' },
            { id: 'neet.physics.mechanics.kinematics', name: 'Kinematics' },
            { id: 'neet.physics.mechanics.laws_motion', name: 'Laws of Motion' },
            { id: 'neet.physics.mechanics.work_energy', name: 'Work, Energy & Power' },
            { id: 'neet.physics.mechanics.rotation', name: 'System of Particles & Rotational Motion' },
            { id: 'neet.physics.mechanics.gravitation', name: 'Gravitation' },
            { id: 'neet.physics.mechanics.properties_matter', name: 'Properties of Bulk Matter' },
            { id: 'neet.physics.mechanics.oscillations', name: 'Oscillations & Waves' },
          ]
        },
        {
          id: 'neet.physics.thermo_electro',
          name: 'Thermodynamics & Electrodynamics',
          topics: [
            { id: 'neet.physics.thermo_electro.thermo', name: 'Thermodynamics' },
            { id: 'neet.physics.thermo_electro.kinetic', name: 'Kinetic Theory' },
            { id: 'neet.physics.thermo_electro.electrostatics', name: 'Electrostatics' },
            { id: 'neet.physics.thermo_electro.current', name: 'Current Electricity' },
            { id: 'neet.physics.thermo_electro.magnetic', name: 'Moving Charges & Magnetism' },
            { id: 'neet.physics.thermo_electro.emi', name: 'Electromagnetic Induction & AC' },
          ]
        },
        {
          id: 'neet.physics.optics_modern',
          name: 'Optics & Modern Physics',
          topics: [
            { id: 'neet.physics.optics_modern.ray', name: 'Ray Optics' },
            { id: 'neet.physics.optics_modern.wave', name: 'Wave Optics' },
            { id: 'neet.physics.optics_modern.dual_nature', name: 'Dual Nature of Radiation & Matter' },
            { id: 'neet.physics.optics_modern.atoms', name: 'Atoms & Nuclei' },
            { id: 'neet.physics.optics_modern.electronics', name: 'Electronic Devices' },
          ]
        }
      ]
    },
    {
      id: 'neet.chemistry',
      name: 'Chemistry',
      subjects: [
        {
          id: 'neet.chemistry.physical',
          name: 'Physical Chemistry',
          topics: [
            { id: 'neet.chemistry.physical.basic', name: 'Basic Concepts of Chemistry' },
            { id: 'neet.chemistry.physical.atomic', name: 'Structure of Atom' },
            { id: 'neet.chemistry.physical.states', name: 'States of Matter' },
            { id: 'neet.chemistry.physical.thermo', name: 'Chemical Thermodynamics' },
            { id: 'neet.chemistry.physical.equilibrium', name: 'Equilibrium' },
            { id: 'neet.chemistry.physical.redox', name: 'Redox Reactions' },
            { id: 'neet.chemistry.physical.solutions', name: 'Solutions' },
            { id: 'neet.chemistry.physical.electrochem', name: 'Electrochemistry' },
            { id: 'neet.chemistry.physical.kinetics', name: 'Chemical Kinetics' },
          ]
        },
        {
          id: 'neet.chemistry.inorganic',
          name: 'Inorganic Chemistry',
          topics: [
            { id: 'neet.chemistry.inorganic.classification', name: 'Classification of Elements' },
            { id: 'neet.chemistry.inorganic.bonding', name: 'Chemical Bonding' },
            { id: 'neet.chemistry.inorganic.hydrogen', name: 'Hydrogen' },
            { id: 'neet.chemistry.inorganic.sblock', name: 's-Block Elements' },
            { id: 'neet.chemistry.inorganic.pblock', name: 'p-Block Elements' },
            { id: 'neet.chemistry.inorganic.dblock', name: 'd & f-Block Elements' },
            { id: 'neet.chemistry.inorganic.coordination', name: 'Coordination Compounds' },
          ]
        },
        {
          id: 'neet.chemistry.organic',
          name: 'Organic Chemistry',
          topics: [
            { id: 'neet.chemistry.organic.basics', name: 'Organic Chemistry Basics' },
            { id: 'neet.chemistry.organic.hydrocarbons', name: 'Hydrocarbons' },
            { id: 'neet.chemistry.organic.haloalkanes', name: 'Haloalkanes & Haloarenes' },
            { id: 'neet.chemistry.organic.oxygen', name: 'Alcohols, Phenols & Ethers' },
            { id: 'neet.chemistry.organic.carbonyl', name: 'Aldehydes, Ketones & Acids' },
            { id: 'neet.chemistry.organic.nitrogen', name: 'Amines' },
            { id: 'neet.chemistry.organic.biomolecules', name: 'Biomolecules' },
          ]
        }
      ]
    },
    {
      id: 'neet.biology',
      name: 'Biology',
      subjects: [
        {
          id: 'neet.biology.botany',
          name: 'Botany',
          topics: [
            { id: 'neet.biology.botany.diversity', name: 'Living World & Biological Classification' },
            { id: 'neet.biology.botany.plant_kingdom', name: 'Plant Kingdom' },
            { id: 'neet.biology.botany.morphology', name: 'Morphology of Flowering Plants' },
            { id: 'neet.biology.botany.anatomy', name: 'Anatomy of Flowering Plants' },
            { id: 'neet.biology.botany.cell', name: 'Cell Biology' },
            { id: 'neet.biology.botany.cell_division', name: 'Cell Cycle & Division' },
            { id: 'neet.biology.botany.transport', name: 'Transport in Plants' },
            { id: 'neet.biology.botany.photosynthesis', name: 'Photosynthesis' },
            { id: 'neet.biology.botany.respiration', name: 'Respiration in Plants' },
            { id: 'neet.biology.botany.growth', name: 'Plant Growth & Development' },
          ]
        },
        {
          id: 'neet.biology.zoology',
          name: 'Zoology',
          topics: [
            { id: 'neet.biology.zoology.animal_kingdom', name: 'Animal Kingdom' },
            { id: 'neet.biology.zoology.structural_org', name: 'Structural Organisation in Animals' },
            { id: 'neet.biology.zoology.digestion', name: 'Digestion & Absorption' },
            { id: 'neet.biology.zoology.breathing', name: 'Breathing & Exchange of Gases' },
            { id: 'neet.biology.zoology.circulation', name: 'Body Fluids & Circulation' },
            { id: 'neet.biology.zoology.excretion', name: 'Excretory Products & Their Elimination' },
            { id: 'neet.biology.zoology.locomotion', name: 'Locomotion & Movement' },
            { id: 'neet.biology.zoology.neural', name: 'Neural Control & Coordination' },
            { id: 'neet.biology.zoology.chemical', name: 'Chemical Coordination' },
          ]
        },
        {
          id: 'neet.biology.genetics',
          name: 'Genetics & Evolution',
          topics: [
            { id: 'neet.biology.genetics.inheritance', name: 'Principles of Inheritance' },
            { id: 'neet.biology.genetics.molecular', name: 'Molecular Basis of Inheritance' },
            { id: 'neet.biology.genetics.evolution', name: 'Evolution' },
            { id: 'neet.biology.genetics.human_health', name: 'Human Health & Disease' },
            { id: 'neet.biology.genetics.microbes', name: 'Microbes in Human Welfare' },
            { id: 'neet.biology.genetics.biotech_principles', name: 'Biotechnology Principles & Processes' },
            { id: 'neet.biology.genetics.biotech_applications', name: 'Biotechnology Applications' },
          ]
        },
        {
          id: 'neet.biology.ecology',
          name: 'Ecology & Environment',
          topics: [
            { id: 'neet.biology.ecology.organisms', name: 'Organisms & Populations' },
            { id: 'neet.biology.ecology.ecosystem', name: 'Ecosystem' },
            { id: 'neet.biology.ecology.biodiversity', name: 'Biodiversity & Conservation' },
            { id: 'neet.biology.ecology.issues', name: 'Environmental Issues' },
            { id: 'neet.biology.ecology.reproduction', name: 'Reproduction in Organisms' },
            { id: 'neet.biology.ecology.human_repro', name: 'Human Reproduction' },
            { id: 'neet.biology.ecology.reproductive_health', name: 'Reproductive Health' },
          ]
        }
      ]
    }
  ]
};
