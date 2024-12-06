import React from 'react'
import SelectPackage from '../../components/selectPackage/SelectPackage'
import MyPackage from '../../components/myPackage/MyPackage'

const Packages = () => {
  const selectedPackage = true
  return (
    <div>
     {selectedPackage ? <MyPackage/>:
      <SelectPackage/>}
    </div>
  )
}

export default Packages