/**
 * FLAMES Game Logic
 * 
 * This module contains all the game logic for the FLAMES game,
 * completely separated from the UI layer.
 */

// FLAMES meanings
export const FLAMES_MEANINGS = {
  F: "Friends",
  L: "Lovers", 
  A: "Affection",
  M: "Marriage",
  E: "Enemies",
  S: "Siblings"
};

// Special override names (case insensitive)
const SPECIAL_NAMES = ['JHEEL', 'VRINDA'];

/**
 * Check if the two names trigger the special soulmates override
 * @param {string} name1 - First person's name (normalized)
 * @param {string} name2 - Second person's name (normalized)
 * @returns {boolean} - Whether this is a special soulmates pair
 */
export function isSpecialSoulmatesPair(name1, name2) {
  const normalizedName1 = name1.toUpperCase();
  const normalizedName2 = name2.toUpperCase();
  
  return (SPECIAL_NAMES.includes(normalizedName1) && SPECIAL_NAMES.includes(normalizedName2) &&
          normalizedName1 !== normalizedName2);
}

/**
 * Normalize a name by converting to uppercase and removing non-alphabetic characters
 * @param {string} name - The name to normalize
 * @returns {string} - The normalized name
 */
export function normalizeName(name) {
  return name.toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Count the frequency of each letter in a name
 * @param {string} name - The normalized name
 * @returns {Object} - Object with letter frequencies
 */
export function getLetterFrequency(name) {
  const frequency = {};
  for (const letter of name) {
    frequency[letter] = (frequency[letter] || 0) + 1;
  }
  return frequency;
}

/**
 * Cross out common letters and get remaining letters
 * @param {string} name1 - First person's name (normalized)
 * @param {string} name2 - Second person's name (normalized)
 * @returns {Object} - Object containing crossed out letters and remaining letters
 */
export function crossOutCommonLetters(name1, name2) {
  // Convert names to arrays for easier manipulation
  let letters1 = name1.split('');
  let letters2 = name2.split('');
  
  const crossedOutLetters = [];
  const crossedOutPositions1 = [];
  const crossedOutPositions2 = [];
  
  // Cross out common letters
  for (let i = 0; i < letters1.length; i++) {
    const letter = letters1[i];
    
    // Find this letter in the second name (if not already crossed out)
    for (let j = 0; j < letters2.length; j++) {
      if (letters2[j] === letter && !crossedOutPositions2.includes(j)) {
        // Mark both positions as crossed out
        crossedOutPositions1.push(i);
        crossedOutPositions2.push(j);
        crossedOutLetters.push(letter);
        break; // Only cross out one occurrence at a time
      }
    }
  }
  
  // Get remaining letters (not crossed out)
  const remainingLetters1 = letters1.filter((_, index) => !crossedOutPositions1.includes(index));
  const remainingLetters2 = letters2.filter((_, index) => !crossedOutPositions2.includes(index));
  
  return {
    name1WithCrossedOut: letters1.map((letter, index) => ({
      letter,
      isCrossedOut: crossedOutPositions1.includes(index)
    })),
    name2WithCrossedOut: letters2.map((letter, index) => ({
      letter,
      isCrossedOut: crossedOutPositions2.includes(index)
    })),
    crossedOutLetters,
    remainingLetters: [...remainingLetters1, ...remainingLetters2],
    totalRemainingCount: remainingLetters1.length + remainingLetters2.length
  };
}

/**
 * Calculate the total count of remaining letters
 * @param {Object} remainingLetters - Object with remaining letter frequencies
 * @returns {number} - Total count of remaining letters
 */
export function getTotalRemainingCount(remainingLetters) {
  return Object.values(remainingLetters).reduce((sum, count) => sum + count, 0);
}

/**
 * Perform the FLAMES elimination process
 * @param {number} count - The count to use for elimination
 * @returns {Array} - Array of elimination steps
 */
export function performFlamesElimination(count) {
  if (count === 0) return [];
  
  let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  const eliminationSteps = [];
  
  while (flames.length > 1) {
    // Calculate the index to eliminate (always start counting from index 0)
    const eliminateIndex = (count - 1) % flames.length;
    const eliminatedLetter = flames[eliminateIndex];
    
    // Store the step
    eliminationSteps.push({
      beforeElimination: [...flames],
      eliminatedLetter,
      eliminatedIndex: eliminateIndex,
      afterElimination: flames.filter((_, index) => index !== eliminateIndex),
      count
    });
    
    // Remove the eliminated letter
    flames.splice(eliminateIndex, 1);
  }
  
  return eliminationSteps;
}

/**
 * Main function to play the FLAMES game
 * @param {string} name1 - First person's name
 * @param {string} name2 - Second person's name
 * @returns {Object} - Complete game result with all steps
 */
export function playFlamesGame(name1, name2) {
  // Step 1: Write down the two names (normalize them)
  const normalizedName1 = normalizeName(name1);
  const normalizedName2 = normalizeName(name2);
  
  if (!normalizedName1 || !normalizedName2) {
    throw new Error('Both names must contain at least one letter');
  }
  
  // Check for special soulmates override
  const isSpecialPair = isSpecialSoulmatesPair(normalizedName1, normalizedName2);
  
  if (isSpecialPair) {
    // For special soulmates, we still need to show the normal steps for the first part
    // Step 2: Cross out the common letters (but we'll show the normal calculation)
    const crossOutResult = crossOutCommonLetters(normalizedName1, normalizedName2);
    
    // Step 3: Count the remaining letters
    const totalRemainingCount = crossOutResult.totalRemainingCount;
    
    // Step 4: Create fake elimination steps for dramatic effect
    const fakeEliminationSteps = [
      {
        beforeElimination: ['F', 'L', 'A', 'M', 'E', 'S'],
        eliminatedLetter: 'E',
        eliminatedIndex: 4,
        afterElimination: ['F', 'L', 'A', 'M', 'S'],
        count: totalRemainingCount
      },
      {
        beforeElimination: ['F', 'L', 'A', 'M', 'S'],
        eliminatedLetter: 'F',
        eliminatedIndex: 0,
        afterElimination: ['L', 'A', 'M', 'S'],
        count: totalRemainingCount
      },
      {
        beforeElimination: ['L', 'A', 'M', 'S'],
        eliminatedLetter: 'A',
        eliminatedIndex: 1,
        afterElimination: ['L', 'M', 'S'],
        count: totalRemainingCount
      }
    ];
    
    // Return special soulmates result with normal step data but special flag
    return {
      originalNames: { name1, name2 },
      normalizedNames: { name1: normalizedName1, name2: normalizedName2 },
      crossOutResult,
      totalRemainingCount,
      eliminationSteps: fakeEliminationSteps,
      isSpecialSoulmates: true,
      finalLetter: '💫',
      result: 'Soulmates'
    };
  }
  
  // Step 2: Cross out the common letters
  const crossOutResult = crossOutCommonLetters(normalizedName1, normalizedName2);
  
  // Step 3: Count the remaining letters
  const totalRemainingCount = crossOutResult.totalRemainingCount;
  
  // Step 4: Eliminate letters from FLAMES
  const eliminationSteps = performFlamesElimination(totalRemainingCount);
  
  // Step 5: Get final result
  const finalLetter = eliminationSteps.length > 0 
    ? eliminationSteps[eliminationSteps.length - 1].afterElimination[0]
    : 'F'; // Default to F if no elimination needed
    
  const result = FLAMES_MEANINGS[finalLetter];
  
  return {
    originalNames: { name1, name2 },
    normalizedNames: { name1: normalizedName1, name2: normalizedName2 },
    crossOutResult,
    totalRemainingCount,
    eliminationSteps,
    finalLetter,
    result,
    isSpecialSoulmates: false
  };
}

/**
 * Validate if names are valid for the game
 * @param {string} name1 - First person's name
 * @param {string} name2 - Second person's name
 * @returns {Object} - Validation result
 */
export function validateNames(name1, name2) {
  const errors = [];
  
  if (!name1 || name1.trim() === '') {
    errors.push('First name is required');
  }
  
  if (!name2 || name2.trim() === '') {
    errors.push('Second name is required');
  }
  
  if (name1 && normalizeName(name1) === '') {
    errors.push('First name must contain at least one letter');
  }
  
  if (name2 && normalizeName(name2) === '') {
    errors.push('Second name must contain at least one letter');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
