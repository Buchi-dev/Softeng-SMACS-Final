# Attendance System with RFID Scanning

This module provides functionality for tracking attendance at events using RFID card scanning.

## Features

- **RFID Card Scanning**: Use any RFID scanner that emulates keyboard input to scan user ID cards
- **Manual ID Entry**: Allow manual entry of ID numbers when RFID scanning is not available
- **Real-time Check-in**: Instantly record attendance with timestamps
- **Attendance Dashboard**: View statistics and metrics for all events
- **Attendance Management**: Detailed attendance records for each event
- **CSV Export**: Export attendance data for reporting and analysis

## How to Use RFID Scanning

1. Connect your RFID scanner device to your computer/tablet
2. Open the Attendance Console page
3. Select an event for check-in
4. Place the RFID card near the scanner
5. The system will automatically detect the ID number and check in the user

## Technical Details

The RFID scanner should be configured as a keyboard emulation device (HID - Human Interface Device), which is the default for most scanners. 

When a card is scanned:
1. The scanner reads the card's ID number
2. It sends the number as keyboard input to the focused input field
3. The system automatically processes the ID and checks in the user

## Compatibility

The system works with most RFID scanners that operate as keyboard emulation devices, including:

- USB RFID Readers (125 kHz or 13.56 MHz)
- NFC Readers configured in keyboard emulation mode
- Barcode scanners for scanning ID cards with barcodes

## Troubleshooting

If your RFID scanner isn't working:

1. Make sure the scanner is properly connected and powered on
2. Verify the scanner is configured for keyboard emulation mode
3. Ensure the input field is focused when scanning
4. Check that your ID cards are compatible with your scanner
5. Try manual entry to verify the backend system is working properly
