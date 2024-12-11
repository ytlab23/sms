
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './../../../firebase/config'
import { Button } from "./../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table"
import { useToast } from "./../ui/use-toast"
import { ScrollArea } from "./../ui/scrollarea"
import { Input } from "./../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select"

type Country = {
  name: string
  included: boolean
}

type FilterOption = 'all' | 'included' | 'not-included'

export default function AddCountries({ onCountryChange }: { onCountryChange: () => void }) {
  const [countries, setCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchCountriesFromFirestore()
  }, [])

  const fetchCountriesFromFirestore = async () => {
    try {
      const countriesSnapshot = await getDocs(collection(db, 'countries'))
      const fetchedCountries: Country[] = []

      countriesSnapshot.forEach((doc) => {
        const countryData = doc.data() as Country
        fetchedCountries.push({ ...countryData, name: doc.id })
      })

      setCountries(fetchedCountries)
    } catch (error) {
      console.error('Error fetching countries:', error)
      toast({
        title: "Error",
        description: "Failed to fetch countries. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleCountry = async (countryName: string, currentIncluded: boolean) => {
    try {
      const countryDocRef = doc(db, 'countries', countryName)
      await updateDoc(countryDocRef, { included: !currentIncluded })
      setCountries(countries.map(country => 
        country.name === countryName ? { ...country, included: !currentIncluded } : country
      ))
      onCountryChange()
      toast({
        variant: "success",
        title: "Success",
        description: `${countryName} has been ${!currentIncluded ? 'added to' : 'removed from'} the list.`,
      })
    } catch (error) {
      console.error('Error toggling country:', error)
      toast({
        title: "Error",
        description: `Failed to update ${countryName}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteCountry = async (countryName: string) => {
    try {
      const countryDocRef = doc(db, 'countries', countryName)
      await deleteDoc(countryDocRef)
      setCountries(countries.filter(country => country.name !== countryName))
      onCountryChange()
      toast({
        title: "Success",
        description: `${countryName} has been deleted.`,
        variant: "success"
      })
    } catch (error) {
      console.error('Error deleting country:', error)
      toast({
        title: "Error",
        description: `Failed to delete ${countryName}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = 
        filterOption === 'all' || 
        (filterOption === 'included' && country.included) || 
        (filterOption === 'not-included' && !country.included)
      return matchesSearch && matchesFilter
    })
  }, [countries, searchTerm, filterOption])

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterOption} onValueChange={(value: FilterOption) => setFilterOption(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter countries" />
          </SelectTrigger>
          <SelectContent className="z-9999 bg-slate-100 ">
            <SelectItem className="hover:text-blue-600" value="all">All Countries</SelectItem>
            <SelectItem className="hover:text-blue-600" value="included">Included</SelectItem>
            <SelectItem className="hover:text-blue-600" value="not-included">Not Included</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[500px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country) => (
              <TableRow key={country.name}>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.included ? 'Included' : 'Not Included'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleToggleCountry(country.name, country.included)}
                    className={`mr-2 ${country.included ? 'bg-red-600 hover:bg-red-500' : ''}`}
                  >
                    {country.included ? 'Remove' : 'Add'}
                  </Button>
                  {/* <Button
                    className='bg-red-600'
                    onClick={() => handleDeleteCountry(country.name)}
                    variant="destructive"
                  >
                    Delete
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}