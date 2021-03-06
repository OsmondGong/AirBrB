import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CreateIcon from '@mui/icons-material/Create';
import { callFetch } from './Fetch';

const getBase64 = (file) => { // code obtained from https://www.codegrepper.com/code-examples/javascript/convert+input+image+to+base64+javascript
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function EditListing () {
  const id = useParams().id;
  const [title, setTitle] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [postcode, setPostcode] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [images, setImages] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('');
  const [numOfBathrooms, setNumOfBathrooms] = React.useState('');
  const [numOfBedrooms, setNumOfBedrooms] = React.useState('');
  const [numOfBeds, setNumOfBeds] = React.useState('');
  const [amenities, setAmenities] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(async () => {
    const data = await callFetch('GET', `/listings/${id}`, undefined, false, false);
    setTitle(data.listing.title);
    setStreet(data.listing.address.street);
    setCity(data.listing.address.city);
    setState(data.listing.address.state);
    setPostcode(data.listing.address.postcode);
    setCountry(data.listing.address.country);
    setPrice(data.listing.price);
    setThumbnail(data.listing.thumbnail);
    setImages(data.listing.metadata.images);
    setPropertyType(data.listing.metadata.propertyType);
    setNumOfBathrooms(data.listing.metadata.numOfBathrooms);
    setNumOfBedrooms(data.listing.metadata.numOfBedrooms);
    setNumOfBeds(data.listing.metadata.numOfBeds);
    setAmenities(data.listing.metadata.amenities);
  }, [])

  const confirmListing = async (e) => {
    e.preventDefault();
    const promises = [];
    Array.from(images).forEach(async (i) => promises.push(getBase64(i)));
    Promise.all(promises)
      .then(async (imagesList) => {
        try {
          const body = {
            title: title,
            address: {
              street: street,
              city: city,
              state: state,
              postcode: postcode,
              country: country
            },
            price: price,
            metadata: {
              propertyType: propertyType,
              numOfBathrooms: numOfBathrooms,
              numOfBedrooms: numOfBedrooms,
              numOfBeds: numOfBeds,
              amenities: amenities,
              images: imagesList
            }
          }
          if (typeof thumbnail !== 'string') {
            const data = await getBase64(thumbnail);
            body.thumbnail = data;
          } else {
            body.thumbnail = thumbnail;
          }
          await callFetch('PUT', `/listings/${id}`, body, true, true);
          navigate('/listing/yourlistings');
        } catch (err) {
          setErrorMsg(err);
        }
      })
  }

  return (
    <>
      { (localStorage.getItem('curToken') !== null)
        ? (
          <Form>
            <TextForm controlId="formGridTitle" formLabel="Title" defaultValue={title} onBlur={e => setTitle(e.target.value)} type="text" placeholder="Enter title" />
            <TextForm controlId="formGridAddress" formLabel="Address" defaultValue={street} onBlur={e => setStreet(e.target.value)} type="text" placeholder="1234 Main St" />
            <Row className="mb-3">
              <TextFormCol controlId="formGridCity" formLabel="City" defaultValue={city} onBlur={e => setCity(e.target.value)} type="text" />
              <TextFormCol controlId="formGridState" formLabel="State" defaultValue={state} onBlur={e => setState(e.target.value)} type="text" />
              <TextFormCol controlId="formGridZip" formLabel="Zip" defaultValue={postcode} onBlur={e => setPostcode(e.target.value)} type="number" />
              <TextFormCol controlId="formGridCountry" formLabel="Country" defaultValue={country} onBlur={e => setCountry(e.target.value)} type="text" />
            </Row>
            <TextForm controlId="formGridPrice" formLabel="Price" defaultValue={price} onBlur={e => setPrice(e.target.value)} type="text" placeholder="Enter price" />
            <Form.Group className="mb-3" controlId="formFile">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control onChange={e => setThumbnail(e.target.files[0])} type="file" data-cy="file-input-thumbnail" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFileImages">
              <Form.Label>Images</Form.Label>
              <Form.Control onChange={e => setImages(e.target.files)} type="file" multiple />
            </Form.Group>
            <Row className="mb-3">
              <TextFormCol controlId="formGridPropertyType" formLabel="Property Type" defaultValue={propertyType} onBlur={e => setPropertyType(e.target.value)} type="text"/>
              <TextFormCol controlId="formGridNumOfBaths" formLabel="Number of bathrooms" defaultValue={numOfBathrooms} onBlur={e => setNumOfBathrooms(e.target.value)} type="text"/>
              <TextFormCol controlId="formGridNumOfBedrooms" formLabel="Number of bedrooms" defaultValue={numOfBedrooms} onBlur={e => setNumOfBedrooms(e.target.value)} type="text"/>
              <TextFormCol controlId="formGridNumOfBeds" formLabel="Number of beds" defaultValue={numOfBedrooms} onBlur={e => setNumOfBeds(e.target.value)} type="text"/>
            </Row>
            <FloatingLabel label="Amenities" controlId="floatingTextarea">
              <Form.Control
                defaultValue={amenities}
                as="textarea"
                placeholder="Amenities"
                style={{ height: '100px' }}
                onBlur={e => setAmenities(e.target.value)}
              />
          </FloatingLabel>
          {(errorMsg === '') ? <></> : (<div className="error-message">{errorMsg}</div>)}
          <Button variant='outlined' startIcon={<CreateIcon />} onClick={confirmListing}>
            Confirm
          </Button>
          <Button variant='outlined' startIcon={<CancelIcon />} onClick={() => { navigate('/listing/yourlistings') }}>
            Cancel
          </Button>
          </Form>)
        : <Navigate to="/"/> }
    </>
  );
}

export const TextForm = ({ controlId, formLabel, defaultValue, onBlur, type, placeholder }) => {
  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label>{formLabel}</Form.Label>
      <Form.Control defaultValue={defaultValue} onBlur={onBlur} type={type} placeholder={placeholder} />
    </Form.Group>
  )
}

export const TextFormCol = ({ controlId, formLabel, defaultValue, onBlur, type, placeholder }) => {
  return (
    <Form.Group className="mb-3" as={Col} controlId={controlId}>
      <Form.Label>{formLabel}</Form.Label>
      <Form.Control defaultValue={defaultValue} onBlur={onBlur} type={type} placeholder={placeholder} />
    </Form.Group>
  )
}

TextForm.propTypes = {
  controlId: PropTypes.string,
  formLabel: PropTypes.string,
  defaultValue: PropTypes.string,
  onBlur: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
}

TextFormCol.propTypes = {
  controlId: PropTypes.string,
  formLabel: PropTypes.string,
  defaultValue: PropTypes.string,
  onBlur: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
}

export default EditListing;
