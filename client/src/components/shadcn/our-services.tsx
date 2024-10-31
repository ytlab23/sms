
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config'; 
import { useTranslation } from 'react-i18next';

export default function InternalPagesShowcase() {
  const [pages, setPages] = useState<Page[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const { t, i18n } = useTranslation()

  type Page = {
    id: string;
    slug: string;
    title: string;
    description: string;
    tags: string[];
  };

  
useEffect(() => {
  const fetchPages = async () => {
    try {
      const pagesCollection = collection(db, 'internal_pages');
      const pagesSnapshot = await getDocs(pagesCollection);

      const pagesList = pagesSnapshot.docs.map((doc) => {
        const data = doc.data();
        

        const content = data.pageContent?.[i18n.language] || {};
        

        const title = content.heading || 'Untitled';
        const description = content.bodyText || 'No description available.';
        const tags = Array.isArray(content.tags) ? content.tags : []; 
       
        return {
          id: doc.id,
          slug: doc.id,
          title: title,
          description: description,
          tags: tags,
        };
      });

      setPages(pagesList); 
    } catch (error) {
    }
  };

  fetchPages();
}, [i18n.language]); 


  
  useEffect(() => {
    const filtered = pages.filter(
      (page: Page) =>
        (page.title &&
          page.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (page.description &&
          page.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (page.tags &&
          page.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
    setFilteredPages(filtered); 
  }, [searchTerm, pages]); 

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      {t("service.Our Services")}
      </motion.h1>
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("service.Search services...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full bg-background border-primary"
        />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredPages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary">{page.slug}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{page.title}</p>
                <div className="flex flex-wrap gap-2">
                  {page.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link to={`/${page.slug}`} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t("service.Learn More")}   
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {filteredPages.length === 0 && (
        <motion.p
          className="text-center text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
        {t("service.No services found matching your search.")}   
        </motion.p>
      )}
    </div>
  );
}
