import { StyleSheet } from 'react-native';
import { COLORS } from '../../../config/theme';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f7fa' },
  scroll: { padding: 16, flexGrow: 1 },
  card: { borderRadius: 16, elevation: 4, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontWeight: 'bold', fontSize: 22, color: COLORS.primary },
  subtitle: { color: COLORS.secondary, fontSize: 14 },
  progress: { height: 6, borderRadius: 3, marginBottom: 24 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});
