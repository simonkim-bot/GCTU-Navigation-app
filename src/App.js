import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  useLoadScript,
} from '@react-google-maps/api'
import { useMemo, useRef, useState } from 'react'


//the App component sets up the configuration 
//for loading the Google Maps API with the specified API key,
// center coordinates, and required libraries (places). 
//The isLoaded variable will be true when the Google Maps API is
// successfully loaded and ready for use in the application.

function App() {

const center = { lat: 5.596391453974103, lng: -0.22343368360766666 } 

const libraries = useMemo(()=>['places'], []);

const apiKey="AIzaSyDU-h7jj1MfnGWdCSbi_SeQFuIZnWN-90E";

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:apiKey,
    libraries: libraries,
  })


// the code initializes state variables using the useState hook to manage the 
//map instance (map), directions response (directionsResponse), 
//distance (distance), and duration (duration). 
//These state variables are used to store and update data related to
// displaying maps and directions within a React component.





  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

//@type  can also be used to specify the type of variables, functions, or objects.

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }


//async function calculateRoute() {:
// This line declares an asynchronous 
//function named calculateRoute. The async keyword 
//indicates that the function will operate asynchronously, meaning it can perform 
//operations such as making asynchronous API calls without blocking the execution of other code.


  async function calculateRoute() {
  //if (originRef.current.value === '' || destiantionRef.current.value === '') 
  //{: This line checks whether the value of originRef or destinationRef is an empty string
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }


  //The provided function clearRoute is a function in a React component that is responsible for 
  //clearing/resetting certain state variables and input fields
  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App


//what are react hooks
//Hooks provide a more composable and 
//reusable way to manage stateful logic in React components,
// making it easier to share logic across components and write cleaner code.

//what are stateful logic?
//Stateful logic refers to the logic within a software component
// that relies on maintaining and updating state over time.


//what are reactcomponents
//React components are the building blocks of React applications. They are reusable, 
//self-contained pieces of code that represent parts of a user interface. React components can be simple, representing just a 
//piece of text or an input field, or they can be complex, representing entire sections of a web page or application.
