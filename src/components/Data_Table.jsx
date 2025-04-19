import React, { useState } from 'react';

export default function Data_Table({
    currentTableData,
    processedData,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    startIndex,
}) {
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const closeModal = () => {
        setSelectedRow(null);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
            <h3 className="text-xl font-semibold mb-4">EV Records</h3>
            <p className='p-2 text-black font-medium'>Click on the row to visit the Vehicle Details</p>
            <div className="overflow-auto md:rounded-md md:shadow-md md:border md:p-4 md:overflow-auto">
                <table className="w-full text-left border-collapse text-green-800">
                    <thead>
                        <tr className="bg-green-300 text-black font-semibold underline">
                            <th className="p-3">SL No.</th>
                            <th className="p-3">Company</th>
                            <th className="p-3">Model</th>
                            <th className="p-3">Year</th>
                            <th className="p-3">Range</th>
                        </tr>
                    </thead>
                    <tbody title='Click to View Details'>
                        {currentTableData.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => handleRowClick(row)}
                                className="border-t hover:bg-green-50 hover:cursor-pointer transition"
                            >
                                <td className="p-3">{startIndex + index + 1}</td>
                                <td className="p-3">{row.make}</td>
                                <td className="p-3">{row.model}</td>
                                <td className="p-3">{row.modelYear}</td>
                                <td className="p-3">{row.range}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-end items-center mt-4 space-x-3">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-md hover:text-white text-black btn btn-neutral btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    <span className="text-green-700 font-medium">Page {currentPage}</span>
                    <button
                        onClick={() =>
                            setCurrentPage((p) =>
                                p < Math.ceil(processedData.length / itemsPerPage) ? p + 1 : p
                            )
                        }
                        disabled={currentPage === Math.ceil(processedData.length / itemsPerPage)}
                        className="px-4 py-2 rounded-md btn btn-neutral btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Popup Modal */}
            {selectedRow && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-x-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl space-y-6 relative">
                        <h4 className="text-2xl font-bold text-green-700 text-center underline">Vehicle Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                            <div><strong className='text-blue-900'>Vehicle ID:</strong> {selectedRow['DOL Vehicle ID'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>Company:</strong> {selectedRow.make}</div>
                            <div><strong className='text-blue-900'>Model:</strong> {selectedRow.model}</div>
                            <div><strong className='text-blue-900'>Year:</strong> {selectedRow.modelYear}</div>
                            <div><strong className='text-blue-900'>Range:</strong> {selectedRow.range}</div>
                            <div><strong className='text-blue-900'>Vehicle Type:</strong> {selectedRow['Vehicle Type'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>City:</strong> {selectedRow.city}</div>
                            <div><strong className='text-blue-900'>County:</strong> {selectedRow.county}</div>
                            <div><strong className='text-blue-900'>Postal Code:</strong> {selectedRow['Postal Code'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>VIN:</strong> {selectedRow.VIN || 'N/A'}</div>
                            <div><strong className='text-blue-900'>CAFVs:</strong> {selectedRow['Clean Alternative Fuel Vehicle (CAFV) Eligibility'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>Legislative District:</strong> {selectedRow['Legislative District'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>2020 Census Tract:</strong> {selectedRow['2020 Census Tract'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>Electric Utility:</strong> {selectedRow['Electric Utility'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>Base MSRP:</strong> {selectedRow['Base MSRP'] || 'N/A'}</div>
                            <div><strong className='text-blue-900'>Incentive Amount:</strong> {selectedRow['Incentive Amount'] || 'N/A'}</div>
                        </div>
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={closeModal}
                                className="mt-4 px-6 py-2 btn btn-outline transition"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}