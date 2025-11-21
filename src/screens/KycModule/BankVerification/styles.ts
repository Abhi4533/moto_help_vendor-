import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 5 },
  subtitle: { color: '#666', fontSize: 14, marginBottom: 20 },

  uploadSection: { marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 14 },

  uploadButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },

  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  previewImage: { width: '100%', height: '100%' },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 20,
  },

  input: { marginBottom: 14 },

  accountTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
  },
  chipSelected: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  chipText: { color: '#555' },
  chipTextSelected: { color: '#fff' },

  submitButton: {
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
