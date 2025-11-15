import React from 'react';
import { FlatList, View } from 'react-native';
import { Chip, Searchbar } from 'react-native-paper';
import { styles } from '../styles';

interface SearchFilter {
  setSearchQuery: any;
  searchQuery: any;
  filterOptions: any;
  selectedStatus: any;
  setSelectedStatus: any;
}

const SearchFilter = ({
  setSearchQuery,
  searchQuery,
  filterOptions,
  selectedStatus,
  setSelectedStatus,
}: SearchFilter) => {
  return (
    <View style={styles.searchSection}>
      <Searchbar
        placeholder="Search vehicles..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
      />

      <FlatList
        horizontal
        data={filterOptions}
        renderItem={({ item }) => (
          <Chip
            selected={selectedStatus === item.status}
            onPress={() => setSelectedStatus(item.status)}
            style={
              selectedStatus === item.status ? styles.chipActive : styles.chip
            }
            mode="outlined"
            textStyle={
              selectedStatus === item.status
                ? styles.chipTextActive
                : styles.chipText
            }
          >
            {item.label}
          </Chip>
        )}
        keyExtractor={item => item.key}
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      />
    </View>
  );
};

export default SearchFilter;
