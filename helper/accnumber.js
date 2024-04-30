function generateRandomAccountNumber() {
    const min = 1000000000; // Minimum 10-digit number (1 followed by nine zeros)
    const max = 9999999999; // Maximum 10-digit number (nine nines)

    // Generate a random number within the specified range
    const randomAccountNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomAccountNumber;
}

export default generateRandomAccountNumber()