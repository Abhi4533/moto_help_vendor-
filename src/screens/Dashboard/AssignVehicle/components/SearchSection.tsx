import React from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';

interface SearchSectionProps {
  setSearchQuery: any;
  searchQuery: any;
}

const SearchSection = ({ searchQuery, setSearchQuery }: SearchSectionProps) => {
  return (
    <View
      style={{
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
      }}
    >
      <Searchbar
        placeholder="Search By vehicle Number/Driver Name"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{
          backgroundColor: '#F1F5F9',
          elevation: 0,
        }}
        icon="magnify"
      />
    </View>
  );
};

export default SearchSection;
