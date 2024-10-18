

// import { useState } from 'react'
// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
// import { Pencil, Trash2, Search } from "lucide-react"
// import { Link } from 'react-router-dom'

// // Mock data for existing pages
// const mockPages = [
//   { id: 1, slug: 'buy-number-for-google', metaTitle: 'Buy Number for Google', createdAt: '2023-05-15' },
//   { id: 2, slug: 'virtual-phone-numbers', metaTitle: 'Virtual Phone Numbers', createdAt: '2023-05-16' },
//   { id: 3, slug: 'sms-verification-service', metaTitle: 'SMS Verification Service', createdAt: '2023-05-17' },
// ]

// export default function InternalPagesList() {
//   const [pages, setPages] = useState(mockPages)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [pageToDelete, setPageToDelete] = useState<{ id: number; slug: string; metaTitle: string; createdAt: string } | null>(null)

//   const filteredPages = pages.filter(page => 
//     page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     page.metaTitle.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleDelete = (id: number) => {
//     setPages(pages.filter(page => page.id !== id))
//     setPageToDelete(null)
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Internal Pages</h1>
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Manage Pages</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex justify-between items-center mb-4">
//             <div className="relative w-64">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search pages..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-8"
//               />
//             </div>
//             <Link to="/create-page">
//               <Button>Create New Page</Button>
//             </Link>
//           </div>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Slug</TableHead>
//                 <TableHead>Meta Title</TableHead>
//                 <TableHead>Created At</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredPages.map((page) => (
//                 <TableRow key={page.id}>
//                   <TableCell className="font-medium">{page.slug}</TableCell>
//                   <TableCell>{page.metaTitle}</TableCell>
//                   <TableCell>{page.createdAt}</TableCell>
//                   <TableCell className="text-right">
//                     <Link to={`/edit-page/${page.id}`}>
//                       <Button variant="ghost" size="icon" className="mr-2">
//                         <Pencil className="h-4 w-4" />
//                         <span className="sr-only">Edit</span>
//                       </Button>
//                     </Link>
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <Button variant="ghost" size="icon" onClick={() => setPageToDelete(page)}>
//                           <Trash2 className="h-4 w-4" />
//                           <span className="sr-only">Delete</span>
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Are you sure you want to delete this page?</DialogTitle>
//                           <DialogDescription>
//                             This action cannot be undone. This will permanently delete the page
//                             "{pageToDelete ? pageToDelete.metaTitle : ''}".
//                           </DialogDescription>
//                         </DialogHeader>
//                         <DialogFooter>
//                           <Button variant="outline" onClick={() => setPageToDelete(null)}>Cancel</Button>
//                           <Button variant="destructive" onClick={() => pageToDelete && handleDelete(pageToDelete.id)}>Delete</Button>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Pencil, Trash2, Search } from "lucide-react";
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Ensure this points to your Firebase setup

export default function InternalPagesList() {
  type Page = {
    id: string;
    slug: string;
    metaTitle: string;
    createdAt: string;
    heading: string;
  };

  const [pages, setPages] = useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  // Fetch pages from Firestore when the component mounts
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesCollection = collection(db, "internal_pages");
        const pagesSnapshot = await getDocs(pagesCollection);
        const pagesList = pagesSnapshot.docs.map((doc) => {
          const data = doc.data().en;
          return {
            id: doc.id,
            slug: data.slug || '', // Default empty string if undefined
            metaTitle: data.metaTitle || '', // Default empty string if undefined
            createdAt: data.createdAt || 'Unknown', // Default value if not present
            heading: data.heading || 'Unknown' // Default value if not present
          };
        });
        setPages(pagesList);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, []);

  // Filter pages based on search term
  const filteredPages = pages.filter((page) => 
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.metaTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "internal_pages", id));
      setPages(pages.filter(page => page.id !== id));
      setPageToDelete(null);
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  // Placeholder for the edit functionality
  const handleEdit = (id: string) => {
    alert(`Page with id: ${id} is being edited!`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Internal Pages</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Link to="/admin382013453sms/add">
              <Button className='text-white'>Create New Page</Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Heading</TableHead>
                {/* <TableHead>Created At</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.slug}</TableCell>
                  <TableCell>{page.heading}</TableCell>
                  {/* <TableCell>{page.createdAt}</TableCell> */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(page.id)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setPageToDelete(page)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to delete this page?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the page
                            "{pageToDelete ? pageToDelete.metaTitle : ''}".
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setPageToDelete(null)}>Cancel</Button>
                          <Button variant="destructive" onClick={() => pageToDelete && handleDelete(pageToDelete.id)}>Delete</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
