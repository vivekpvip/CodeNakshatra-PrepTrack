export const jeeSyllabus = {
  id: 'jee',
  name: 'JEE Main + Advanced',
  papers: [
    {
      id: 'jee.physics',
      name: 'Physics',
      subjects: [
        {
          id: 'jee.physics.mechanics',
          name: 'Mechanics',
          topics: [
            { id: 'jee.physics.mechanics.kinematics', name: 'Kinematics' },
            { id: 'jee.physics.mechanics.newtons_laws', name: "Newton's Laws of Motion" },
            { id: 'jee.physics.mechanics.work_energy', name: 'Work, Energy & Power' },
            { id: 'jee.physics.mechanics.rotational', name: 'Rotational Motion' },
            { id: 'jee.physics.mechanics.gravitation', name: 'Gravitation' },
            { id: 'jee.physics.mechanics.shm', name: 'Simple Harmonic Motion' },
            { id: 'jee.physics.mechanics.fluid', name: 'Fluid Mechanics' },
            { id: 'jee.physics.mechanics.momentum', name: 'Centre of Mass & Momentum' },
          ]
        },
        {
          id: 'jee.physics.thermo',
          name: 'Thermodynamics & Waves',
          topics: [
            { id: 'jee.physics.thermo.heat', name: 'Heat & Temperature' },
            { id: 'jee.physics.thermo.kinetic_theory', name: 'Kinetic Theory of Gases' },
            { id: 'jee.physics.thermo.laws', name: 'Laws of Thermodynamics' },
            { id: 'jee.physics.thermo.waves', name: 'Waves & Sound' },
            { id: 'jee.physics.thermo.strings', name: 'Standing Waves & Strings' },
          ]
        },
        {
          id: 'jee.physics.electro',
          name: 'Electromagnetism',
          topics: [
            { id: 'jee.physics.electro.electrostatics', name: 'Electrostatics' },
            { id: 'jee.physics.electro.current', name: 'Current Electricity' },
            { id: 'jee.physics.electro.magnetic', name: 'Magnetic Effects of Current' },
            { id: 'jee.physics.electro.emi', name: 'Electromagnetic Induction' },
            { id: 'jee.physics.electro.ac', name: 'Alternating Current' },
            { id: 'jee.physics.electro.em_waves', name: 'Electromagnetic Waves' },
          ]
        },
        {
          id: 'jee.physics.optics',
          name: 'Optics & Modern Physics',
          topics: [
            { id: 'jee.physics.optics.ray', name: 'Ray Optics' },
            { id: 'jee.physics.optics.wave', name: 'Wave Optics' },
            { id: 'jee.physics.optics.modern', name: 'Dual Nature of Matter' },
            { id: 'jee.physics.optics.atomic', name: 'Atoms & Nuclei' },
            { id: 'jee.physics.optics.semiconductor', name: 'Semiconductor Electronics' },
          ]
        }
      ]
    },
    {
      id: 'jee.chemistry',
      name: 'Chemistry',
      subjects: [
        {
          id: 'jee.chemistry.physical',
          name: 'Physical Chemistry',
          topics: [
            { id: 'jee.chemistry.physical.mole', name: 'Mole Concept & Stoichiometry' },
            { id: 'jee.chemistry.physical.atomic', name: 'Atomic Structure' },
            { id: 'jee.chemistry.physical.bonding', name: 'Chemical Bonding' },
            { id: 'jee.chemistry.physical.thermo', name: 'Chemical Thermodynamics' },
            { id: 'jee.chemistry.physical.equilibrium', name: 'Chemical Equilibrium' },
            { id: 'jee.chemistry.physical.kinetics', name: 'Chemical Kinetics' },
            { id: 'jee.chemistry.physical.electrochem', name: 'Electrochemistry' },
            { id: 'jee.chemistry.physical.solutions', name: 'Solutions' },
            { id: 'jee.chemistry.physical.surface', name: 'Surface Chemistry' },
          ]
        },
        {
          id: 'jee.chemistry.inorganic',
          name: 'Inorganic Chemistry',
          topics: [
            { id: 'jee.chemistry.inorganic.periodic', name: 'Periodic Table & Properties' },
            { id: 'jee.chemistry.inorganic.sblock', name: 's-Block Elements' },
            { id: 'jee.chemistry.inorganic.pblock', name: 'p-Block Elements' },
            { id: 'jee.chemistry.inorganic.dblock', name: 'd & f-Block Elements' },
            { id: 'jee.chemistry.inorganic.coordination', name: 'Coordination Compounds' },
            { id: 'jee.chemistry.inorganic.qualitative', name: 'Qualitative Analysis' },
          ]
        },
        {
          id: 'jee.chemistry.organic',
          name: 'Organic Chemistry',
          topics: [
            { id: 'jee.chemistry.organic.basics', name: 'GOC & Isomerism' },
            { id: 'jee.chemistry.organic.hydrocarbons', name: 'Hydrocarbons' },
            { id: 'jee.chemistry.organic.halides', name: 'Alkyl & Aryl Halides' },
            { id: 'jee.chemistry.organic.alcohols', name: 'Alcohols, Phenols & Ethers' },
            { id: 'jee.chemistry.organic.carbonyl', name: 'Aldehydes, Ketones & Carboxylic Acids' },
            { id: 'jee.chemistry.organic.amines', name: 'Amines' },
            { id: 'jee.chemistry.organic.biomolecules', name: 'Biomolecules' },
            { id: 'jee.chemistry.organic.polymers', name: 'Polymers' },
          ]
        }
      ]
    },
    {
      id: 'jee.maths',
      name: 'Mathematics',
      subjects: [
        {
          id: 'jee.maths.algebra',
          name: 'Algebra',
          topics: [
            { id: 'jee.maths.algebra.quadratic', name: 'Quadratic Equations' },
            { id: 'jee.maths.algebra.complex', name: 'Complex Numbers' },
            { id: 'jee.maths.algebra.sequences', name: 'Sequences & Series' },
            { id: 'jee.maths.algebra.binomial', name: 'Binomial Theorem' },
            { id: 'jee.maths.algebra.pnc', name: 'Permutations & Combinations' },
            { id: 'jee.maths.algebra.matrices', name: 'Matrices & Determinants' },
            { id: 'jee.maths.algebra.probability', name: 'Probability' },
          ]
        },
        {
          id: 'jee.maths.calculus',
          name: 'Calculus',
          topics: [
            { id: 'jee.maths.calculus.limits', name: 'Limits & Continuity' },
            { id: 'jee.maths.calculus.derivatives', name: 'Differentiation' },
            { id: 'jee.maths.calculus.application', name: 'Application of Derivatives' },
            { id: 'jee.maths.calculus.integration', name: 'Indefinite Integration' },
            { id: 'jee.maths.calculus.definite', name: 'Definite Integration' },
            { id: 'jee.maths.calculus.area', name: 'Area Under Curves' },
            { id: 'jee.maths.calculus.diffeq', name: 'Differential Equations' },
          ]
        },
        {
          id: 'jee.maths.coordinate',
          name: 'Coordinate Geometry',
          topics: [
            { id: 'jee.maths.coordinate.straight', name: 'Straight Lines' },
            { id: 'jee.maths.coordinate.circles', name: 'Circles' },
            { id: 'jee.maths.coordinate.parabola', name: 'Parabola' },
            { id: 'jee.maths.coordinate.ellipse', name: 'Ellipse' },
            { id: 'jee.maths.coordinate.hyperbola', name: 'Hyperbola' },
          ]
        },
        {
          id: 'jee.maths.trig',
          name: 'Trigonometry & Vectors',
          topics: [
            { id: 'jee.maths.trig.ratios', name: 'Trigonometric Ratios & Equations' },
            { id: 'jee.maths.trig.inverse', name: 'Inverse Trigonometry' },
            { id: 'jee.maths.trig.vectors', name: 'Vectors' },
            { id: 'jee.maths.trig.3d', name: '3D Geometry' },
          ]
        }
      ]
    }
  ]
};
