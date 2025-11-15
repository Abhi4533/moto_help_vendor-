import { Button } from 'react-native-paper';
import { styles } from '../style';

const TabButton = ({
  tab,
  icon,
  label,
  activeTab,
  setActiveTab,
}: {
  tab: string;
  icon: string;
  label: string;
  activeTab: any;
  setActiveTab: any;
}) => (
  <Button
    mode={activeTab === tab ? 'contained' : 'outlined'}
    onPress={() => setActiveTab(tab as any)}
    style={styles.tabButton}
    icon={icon}
    compact
  >
    {label}
  </Button>
);

export default TabButton;
