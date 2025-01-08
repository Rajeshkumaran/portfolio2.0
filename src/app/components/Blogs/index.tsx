'use client';
import Image from 'next/image';
import blogGitBasics from '../../assets/blogGitBasics.webp';
import pursuitOfHappiness from '../../assets/pursuitOfHappiness.webp';
import linkIcon from '../../assets/linkIcon.png';

import './index.css';

const blogs = [
  {
    name: 'Pursuit of happiness',
    image: pursuitOfHappiness,
    link: 'https://rajeshkumaran1996.medium.com/my-pursuit-of-happiness-moment-62735b75e286',
  },
  {
    name: 'Git Basics',
    image: blogGitBasics,
    link: 'https://rajeshkumaran1996.medium.com/git-basics-for-beginners-fcf762304bcc',
  },
];
const Blogs = () => {
  return (
    <div className='flex mb-5'>
      <div className='flex-1 flex flex-col gap-4 pt-4 lg:pt-10'>
        <h3 className='xs:text-sm lg:text-xl'>Blogs</h3>
        <div className='flex gap-6 mt-3'>
          {blogs.map((blog, index) => (
            <div
              key={`blog-img-${index}`}
              className='card'
              onClick={() => {
                window.open(blog.link);
              }}
            >
              <div>
                <Image
                  src={blog.image}
                  alt={blog.name}
                  className='min-w-[150px] min-h-[150px] lg:w-[300px] lg:h-[300px] rounded-t-lg'
                />
              </div>
              <div className='flex p-4 items-center gap-3'>
                <p className='text-black'>{blog.name}</p>
                <Image
                  src={linkIcon}
                  alt='link'
                  className='w-[16px] h-[16px] cursor-pointer'
                  onClick={() => {
                    window.open(blog.link);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
