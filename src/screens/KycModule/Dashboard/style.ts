import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f7f7f7',
  },

  // ---- STEP INDICATOR ----
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 5,
  },
  stepBlock: {
    alignItems: 'center',
    width: '23%',
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  circleText: {
    color: '#fff',
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ---- STEP INSTRUCTIONS ----
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  instructionBox: {
    marginVertical: 4,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  instructionDesc: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  bold: { fontWeight: '700' },

  // ---- BUTTONS ----
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  box: {
    backgroundColor: '#fff',
    width: '32%',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 4,
  },
  boxText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  subInfo: {
    fontSize: 11,
    marginTop: 3,
    color: '#555',
  },

  // ---- DISABLED KYC ----
  disabledBox: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
  lockText: {
    fontSize: 11,
    color: '#d00',
    marginTop: 4,
  },
});
