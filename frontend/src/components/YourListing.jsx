import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { callFetch } from './Fetch'
import Button from '@mui/material/Button';
import { unpublish } from './UnpublishListing';

function YourListing ({ listing }) {
  const listingId = listing.id;
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [thumbnail, setThumbNail] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [numOfBaths, setNumOfBaths] = React.useState('');
  const [numOfBedrooms, setNumOfBedrooms] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [addressStr, setAddressStr] = React.useState('');
  const [availability, setAvailability] = React.useState([]);
  const navigate = useNavigate();

  useEffect(async () => {
    const data = await callFetch('GET', `/listings/${listingId}`, undefined, false, false);
    setTitle(data.listing.title);
    setPrice(data.listing.price);
    setThumbNail(data.listing.thumbnail);
    setPropertyType(data.listing.metadata.propertyType);
    setNumOfBaths(data.listing.metadata.numOfBaths);
    setNumOfBedrooms(data.listing.metadata.numOfBedrooms);
    setAmenities(data.listing.metadata.amenities);
    setAvailability(data.listing.availability);
    const address = data.listing.address;

    let addressStrCompile = '';
    (address.street !== undefined) && (addressStrCompile += address.street + ' ');
    (address.city !== undefined) && (addressStrCompile += address.city + ' ');
    (address.state !== undefined) && (addressStrCompile += address.state + ' ');
    (address.postcode !== undefined) && (addressStrCompile += address.postcode + ' ');
    (address.country !== undefined) && (addressStrCompile += address.country + ' ');

    setAddressStr(addressStrCompile);
  }, [])

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={thumbnail} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>Address: {(addressStr !== '') ? <> {addressStr} </> : 'N/A'}</ListGroupItem>
          <ListGroupItem>${price} per night</ListGroupItem>
          <ListGroupItem>Property Type: {(propertyType !== undefined) ? <> {propertyType} </> : 'N/A'}</ListGroupItem>
          <ListGroupItem>Number of Bathrooms: {(numOfBaths !== undefined) ? <> {numOfBaths} </> : 'N/A'}</ListGroupItem>
          <ListGroupItem>Number of Bedrooms: {(numOfBedrooms !== undefined) ? <> {numOfBedrooms} </> : 'N/A'}</ListGroupItem>
          <ListGroupItem>Amenities: {(amenities !== undefined) ? <> {amenities} </> : 'N/A'}</ListGroupItem>
          <>
            <Button onClick={() => navigate(`/listing/editlisting/${listing.id}`)} variant="primary">Edit</Button>
            {availability.length === 0
              ? <Button onClick={() => navigate(`/listing/publishlisting/${listingId}`)} variant="primary">Publish</Button>
              : <>
              <Button onClick={() => { navigate(`/listing/yourlistings/bookingrequests/${listingId}`) }} variant="primary">View Booking Requests</Button>
              <Button onClick={() => { unpublish(listingId, setAvailability) }} variant="primary">Unpublish</Button>
              </>}
          </>
        </ListGroup>
      </Card>
    </>
  )
}

YourListing.propTypes = {
  listing: PropTypes.object,
}

export default YourListing;
