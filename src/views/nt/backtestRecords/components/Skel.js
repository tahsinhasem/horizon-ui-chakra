import { Box, Flex, SkeletonCircle, SkeletonText} from '@chakra-ui/react'
import Card from 'components/card/Card'

export default function Skel(props) {
  return (

    <Card padding='6' marginY='5' boxShadow='lg'>

          <SkeletonCircle size='10' />
          <SkeletonText mt='5' noOfLines={5} spacing='4' skeletonHeight='2' />
    </Card>
  
  )
}